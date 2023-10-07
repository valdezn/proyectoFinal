import chai from 'chai';
import { request } from 'express';
import _ from 'mongoose-paginate-v2';
import supertest from 'supertest';

const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('test ecommerce', () => {
    describe('test products', () => {

        it('GET /api/products/ debe devolver todos los productos correctamente en un Array', async () => {
            const { statusCode, ok, _body } = await requester
                .get('/api/products/')
            //console.log(statusCode, ok, _body)
            expect(Array.isArray(_body.docs)).to.be.equal(true)
        })
        it('GET /api/products/:pid debe devoler un producto por id correctamente', async () => {
            const pid = '64ffb306d80ec9963ea419fb'
            const { statusCode, ok, _body } = await requester
                .get('/api/products/' + pid)
                //console.log(statusCode, ok, _body); 
                expect(_body).to.have.property('_id');
                expect(ok).to.be.ok
        }).timeout(10000);

        it('POST /api/products/ debe crear un producto correctamente', async () => {
            const mokProduct = {
                name: "AQX Glossy 10 x 15",
                description: "200 Grs. - 20 hojas",
                price: 650,
                thumbnail: [],
                category: "resmas",
                code: "F18",
                stock: 50,
                owner: ""
            }
            const { statusCode, ok, _body } = await requester
                .post('/api/products/')
                .send(mokProduct)
            //console.log(statusCode, ok, _body)
        }).timeout(10000);
    })

    describe("test sessions", () => {
        let cookie;
        it("POST /api/sessions/register registrar un usuario", async () => { ///hay que registrar uno nuevo cada vez, sino da error pq ya existe
          const mockUser = {
            first_name: "Usuario14",
            last_name: "Usuario14",
            email: "valdeznoelia26+14@gmail.com",
            password: "1234",
          };
          const result = await requester
            .post("/api/sessions/register")
            .send(mockUser);
          expect(result.body).to.be.ok;
        }).timeout(3500);

        it("POST /api/sessions/login logear un usuario", async () => {
            const mockUser = {
              email: "valdeznoelia26+7@gmail.com",
              password: "1234",
            };
            const result = await requester.post("/api/sessions/login").send(mockUser);
            //console.log(result);
            const cookieResult = result.headers["set-cookie"][0];
            expect(cookieResult).to.be.ok;
            cookie = {
              name: cookieResult.split("=")[0],
              value: cookieResult.split("=")[1],
            };
        }).timeout(3000);
      
        it("GET api/sessions/current", async () => {
            const result = await requester
              .get("/api/sessions/current")
              .set("Cookie", [`${cookie.name}=${cookie.value}`]);
           //console.log(result._body)
            expect(result._body.first_name).to.be.ok
        }).timeout(3000);
    })

    describe('test carts', () => {

        it('POST api/carts/:cid/product/:pid/ debe agregar un producto al carrito', async () => {
            const cid = '650f0bbd2b87b748d79c1138'
            const pid = '64ffb2816112978ae0e45cef'
            const result = await requester
                .post('/api/carts/' + cid + '/product/' + pid)
        }).timeout(30000);


        it('GET /api/carts/:cid debe devolver el carrito por id', async () => {
          const cid = '650f0bbd2b87b748d79c1138'
          const { statusCode, ok, _body} = await requester
                .get('/api/carts/' + cid)
                expect(_body).to.have.property('products')
                expect(ok).to.be.ok 
        }).timeout(30000);

        it('PUT /api/carts/cid/ debe actualizar el carrito', async () => {
            const cid = '650f0bbd2b87b748d79c1138'
            const mokCart = [
                {
                    "product": {
                        "_id": "64ffac0af8a029766801b341",
                        "name": "AQX Glossy 13 x 18",
                        "description": "200 Grs. - 20 hojas",
                        "price": 2500,
                        "thumbnail": [
                            "foto"
                        ],
                        "category": "resma",
                        "code": "F09",
                        "stock": 10
                    },
                    "quantity": 10
                }
            ]
            const {ok, text} = await requester
                .put('/api/carts/' + cid)
                .send(mokCart)
                expect(ok).to.be.ok
                expect(text).to.be.equal('Se ha actualizado el carrito con id: ' + "'" + cid + "'" + '.')
                //console.log(text) 
        }).timeout(30000);
    })
})