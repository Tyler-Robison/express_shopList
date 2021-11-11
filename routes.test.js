process.env.NODE_ENV = 'test';

const request = require('supertest');

const app = require('./app');
let items = require('./fakeDb');

let item1 = {};
let item2 = {};

beforeEach(function () {
    items.length = 0;

    item1.name = 'Candy';
    item1.price = 1.50;

    item2.name = 'Gum';
    item2.price = 0.50;

    items.push(item1);
    items.push(item2);
});

afterEach(function () {
    // make sure this *mutates*, not redefines, `cats`
    items.length = 0;
});

describe("GET /items", () => {
    test("GET all items", async () => {
        const resp = await request(app).get('/items');

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ "items": [item1, item2] })
    })

    test("GET individual item", async () => {
        const resp = await request(app).get('/items/Candy');

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ "item": item1 })
    })

    test("GET 404 error", async () => {
        const resp = await request(app).get('/items/badItem');

        expect(resp.statusCode).toBe(404);
    })
});

describe("POST /items", () => {
    test("Post new item", async () => {
        const resp = await request(app)
            .post('/items')
            .send({
                name: 'Spinach',
                price: 4.00
            })

        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({ "item": { name: 'Spinach', price: 4.00 } })
    })

    test("400 because no name", async () => {
        const resp = await request(app)
            .post('/items')
            .send({
                price: 4.00
            })

        expect(resp.statusCode).toBe(400);
    })

    test("400 because no price", async () => {
        const resp = await request(app)
            .post('/items')
            .send({
                name: 'Spinach'
            })

        expect(resp.statusCode).toBe(400);

    })

    test("400 because duplicate name", async () => {
        const resp = await request(app)
            .post('/items')
            .send({
                name: 'Candy',
                price: 4.00
            })

        expect(resp.statusCode).toBe(400);
    })
})

describe("PATCH /items/:name", () => {
    test("patch existing item", async () => {
        const resp = await request(app)
            .patch(`/items/${item1.name}`)
            .send({
                name: 'YummyCandy',
                price: 2.00
            })

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ "item": { name: "YummyCandy", price: 2.00 } })
    })

    test("404 item not found", async () => {
        const resp = await request(app)
            .patch(`/items/Tomatoes`)
            .send({
                name: 'YummyCandy',
                price: 2.00
            })

        expect(resp.statusCode).toBe(404);

    })

    test("400 no name", async () => {
        const resp = await request(app)
            .patch(`/items/${item1.name}`)
            .send({
                price: 2.00
            })

        expect(resp.statusCode).toBe(400);

    })

    test("400 no price", async () => {
        const resp = await request(app)
            .patch(`/items/${item1.name}`)
            .send({
                name: 'YummyCandy',
            })

        expect(resp.statusCode).toBe(400);

    })
})

describe("/DELETE /items/:name", () => {
    test("delete item", async () => {
        console.log('**********', item1)
        const resp = await request(app).delete(`/items/Gum`)

        expect(resp.statusCode).toBe(200);
        // expect(resp.body).toEqual("test")
    })

    test("404 item not found", async () => {
        const resp = await request(app)
            .delete(`/items/Tomato`)

        expect(resp.statusCode).toBe(404);
    })
})

describe("404 response", () => {
    test("Invalid URL", async () => {
        const resp = await request(app).get(`/invalid`);

        expect(resp.statusCode).toBe(404);
    });
});