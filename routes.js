const express = require("express")
const router = new express.Router()
const ExpressError = require("./expressError")
const items = require("./fakeDb")

// GET all items
router.get("/", (req, res, next) => {
    try {
        res.json({ items })
    } catch (err) {
        next(err)
    }
})

// GET indiv item based on name
router.get("/:name", (req, res, next) => {
    try {
        const foundItem = items.find(item => item.name === req.params.name)
        if (!foundItem) throw new ExpressError("Item not found", 404)

        res.json({ item: foundItem })
    } catch (err) {
        next(err)
    }
})

// POST new item
// Can't be duplicate and must have name/price
router.post('/', (req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0) throw new ExpressError('Must submit an item', 400)
        const postedItem = req.body
        const duplicateItem = items.find(item => item.name === postedItem.name)
        if (duplicateItem) throw new ExpressError('No duplicate names', 400)
        if (!postedItem.name) throw new ExpressError('Item must have a name', 400)
        if (!postedItem.price) throw new ExpressError('Item must have a price', 400)
        items.push(postedItem)
        return res.status(201).json({ item: postedItem })
    } catch (err) {
        return next(err)
    }
})

// PATCHES an item -> edit name and/or price
router.patch('/:name', (req, res, next) => {
    try {
        const foundItem = items.find(item => item.name === req.params.name)
        if (!foundItem) throw new ExpressError("Item not found", 404)

        if (Object.keys(req.body).length === 0) throw new ExpressError('Must submit an item', 400)
        if (!req.body.name) throw new ExpressError('Must enter a new name', 400)
        if (!req.body.price) throw new ExpressError('Must enter a new price', 400)
        foundItem.name = req.body.name
        foundItem.price = req.body.price

        return res.json({ item: foundItem })
    } catch (err) {
        next(err)
    }
})

// DELETES an item
router.delete('/:name', (req, res, next) => {
    try {
        const foundIdx = items.findIndex(item => item.name === req.params.name)
        console.log('found', foundIdx)
        if (!foundIdx || foundIdx === -1) throw new ExpressError("Item not found", 404)
        // console.log('found', foundIdx)
        items.splice(foundIdx, 1)

        return res.json({ message: "Deleted" })
    } catch (err) {
        next(err)
    }
})

module.exports = router;