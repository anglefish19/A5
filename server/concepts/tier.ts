import { Filter, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";

export interface TierDoc extends BaseDoc {
  owner: ObjectId;
  items: ObjectId[];
  name: string;
  priority: number;
}

export default class TierConcept {
  public readonly tiers = new DocCollection<TierDoc>("tiers");

  async create(owner: ObjectId, name: string, priority: number) {
    this.canCreate(name, priority);
    const items: ObjectId[] = [];
    const _id = await this.tiers.createOne({ owner, items, name, priority });
    return { msg: "Tier successfully created!", tier: await this.tiers.readOne({ _id }) };
  }

  async getTiers(query: Filter<TierDoc>) {
    const tiers = await this.tiers.readMany(query, {
      sort: { priority: 1 },
    });
    return tiers;
  }

  async getByOwner(owner: ObjectId) {
    return await this.getTiers({ owner });
  }

  async update(_id: ObjectId, update: Partial<TierDoc>) {
    this.sanitizeUpdate(update);
    if (update.name !== undefined || update.priority !== undefined) {
      this.canUpdate(update.name, update.priority);
    }
    await this.tiers.updateOne({ _id }, update);
    return { msg: "Tier successfully updated!" };
  }

  async delete(_id: ObjectId) {
    await this.tiers.deleteOne({ _id });
    return { msg: "Tier deleted successfully!" };
  }

  async isOwner(user: ObjectId, _id: ObjectId) {
    const tier = await this.tiers.readOne({ _id });
    if (!tier) {
      throw new NotFoundError(`Tier ${_id} does not exist!`);
    }
    if (tier.owner.toString() !== user.toString()) {
      throw new TierOwnerNotMatchError(user, _id);
    }
  }

  async isItemInTier(_id: ObjectId, item: ObjectId) {
    const tier = await this.tiers.readOne({ _id });
    if (!tier) {
      throw new NotFoundError(`Tier ${_id} does not exist!`);
    }
    if (tier.items.indexOf(item) !== -1) {
      return true;
    }
    return false;
  }

  private sanitizeUpdate(update: Partial<TierDoc>) {
    const allowedUpdates = ["name", "priority"];
    for (const key in update) {
      if (!allowedUpdates.includes(key)) {
        throw new NotAllowedError(`Cannot update '${key}' field!`);
      }
    }
  }

  async updateItem(_id: ObjectId, item: ObjectId, fxn: string) {
    const tier = await this.tiers.readOne({ _id });
    const contents = tier?.items;
    if (!item) {
      throw new BadValuesError("No item given.");
    }

    if (fxn === "add") {
      contents?.push(item);
      const update: Partial<TierDoc> = { items: contents };
      this.sanitizeItemUpdate(update);
      await this.tiers.updateOne({ _id }, update);
      return { msg: "Item added!" };
    } else if (fxn === "delete") {
      const index = contents?.indexOf(item);
      if (index && index > -1) {
        contents?.splice(index, 1);
      }
      const update: Partial<TierDoc> = { items: contents };
      this.sanitizeItemUpdate(update);
      await this.tiers.updateOne({ _id }, update);
      return { msg: "Item removed!" };
    }
    throw new NotAllowedError(`'${fxn}' is not an action that can be performed on the items of a tier.`);
  }

  private canUpdate(name: string | undefined, priority: number | undefined) {
    if (!name && !priority) {
      throw new BadValuesError("Tier must have a name and a priority.");
    }
    if (priority !== undefined && isNaN(priority)) {
      throw new BadValuesError("Tier priority must be a number.");
    }
  }

  private canCreate(name: string, priority: number) {
    if (!name || !priority) {
      throw new BadValuesError("Tier must have a name and a priority.");
    }
    if (isNaN(priority)) {
      throw new BadValuesError("Tier priority must be a number.");
    }
  }

  private sanitizeItemUpdate(update: Partial<TierDoc>) {
    const allowedUpdates = ["items"];
    for (const key in update) {
      if (!allowedUpdates.includes(key)) {
        throw new NotAllowedError(`Cannot update '${key}' field!`);
      }
    }
  }
}

export class TierOwnerNotMatchError extends NotAllowedError {
  constructor(
    public readonly owner: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the owner of tier {1}!", owner, _id);
  }
}
