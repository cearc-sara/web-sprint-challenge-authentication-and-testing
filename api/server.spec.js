const supertest = require("supertest")
const db = require("../database/dbConfig")
const server = require("./server")
const auth = require("../auth/auth-router")
const jokes = require("../jokes/jokes-router")


describe("auth-router.js", () => {
    describe("POST /register", () => {
        beforeEach(async () => {
            await db("users").truncate()
        })
        it("should return the registered new user", async () => {
            const frodo = await supertest(server)
            .post("/api/auth/register")
            .send({username: "Frodo", password: "Baggins"})
            expect(frodo.body.users.username).toBe("Frodo")
        })
        it("should return the registered new user", async () => {
            const samwise = await supertest(server)
            .post("/api/auth/register")
            .send({username: "Samwise", password: "Gamgee"})
            expect(samwise.body.users.username).toBe("Samwise")
        })
    })
    describe("POST /login", () => {
        it("should login with status code", async () => {
            const frodo = await supertest(server)
            .post("/api/auth/login")
            .send({username: "Samwise", password: "Gamgee"})
            expect(frodo.status).toBe(200)
        })
        it("should login the user with a welcome message", async () => {
            const samwise = await supertest(server)
            .post("/api/auth/login")
            .send({username: "Samwise", password: "Gamgee"})
            expect(samwise.body.message).toBe("Welcome to the Shire")
        })
    })
})