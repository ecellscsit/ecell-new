import { asyncH } from '../middleware/error.js';

// Generic list/get/create/update/delete for simple modules (team, startups, gallery...)
export const crudFactory = (Model, { sort = { createdAt: -1 }, filterFields = [] } = {}) => ({
  list: asyncH(async (req, res) => {
    const filter = {};
    filterFields.forEach((f) => req.query[f] && (filter[f] = req.query[f]));
    res.json(await Model.find(filter).sort(sort));
  }),
  get: asyncH(async (req, res) => {
    const doc = await Model.findById(req.params.id);
    doc ? res.json(doc) : res.status(404).json({ message: 'Not found' });
  }),
  create: asyncH(async (req, res) => res.status(201).json(await Model.create(req.body))),
  update: asyncH(async (req, res) =>
    res.json(await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }))),
  remove: asyncH(async (req, res) => {
    await Model.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  }),
});
