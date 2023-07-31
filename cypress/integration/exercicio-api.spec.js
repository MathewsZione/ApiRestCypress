/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'

var faker = require ('faker-br')

describe('Testes da Funcionalidade Usuários', () => {
     let token
     before(() => {
         cy.token('fulaneti@qa.com.br', 'teste').then(tkn => { token = tkn })
     });
     

    it('Deve validar contrato de usuários', () => {

       cy.request('usuarios').then( response => {
          return contrato.validateAsync(response.body) 
       })

    });

    it('Deve listar usuários cadastrados', () => {

         cy.request({
          method: 'GET',
          url: 'usuarios'
         }).then((response) =>{
          expect(response.status).to.equal(200)
         })
    });


    it.only('Deve cadastrar um usuário com sucesso',async () => {

        cy.request({
            method: 'POST',
            url: 'usuarios',
            body: {
                "name": faker.name.firstName(),
                "email": faker.internet.email(),
                "password": faker.internet.password(),
                "administrador": 'true'
            }
        })
        .then((response) =>{
          expect(response.status).to.equal(201)
          expect(response.body.message).to.equal("Cadastro realizado com sucesso")
         })
    });

    it('Deve validar um usuário com email inválido', () => {
       cy.cadastrarUsuario('nome', 'beltrano@qa.com.br', 'teste', 'true')
       .then(response =>{
        expect(response.status).to.equal(400)
        expect(response.body.email).to.equal("email deve ser um email válido")
       })
    });

    it('Deve editar um usuário previamente cadastrado', () => {
        cy.request('usuarios').then(response =>{
            let id = response.body.usuarios[0]._id
            cy.request({
                method: 'PUT',
                url: `usuarios/${id}`,
                headers: {authorization: token},
                body: {
                    "nome": "Fulano da Silvaa",
                    "email": "beltrano@qa.com.br",
                    "password": "teste",
                    "administrador": "true"
                  }
        }).then(response =>{
            expect(response.body.message).to.equal("Registro alterado com sucesso")
            expect(response.status).to.equal(200)
        })
       })
    });

    it('Deve deletar um usuário previamente cadastrado', () => {
        cy.request('usuarios').then(response =>{
            let id = response.body.usuarios[0]._id
            cy.request({
                method: 'DELETE',
                url: `usuarios/${id}`,
                headers: {authorization: token},
        }).then(response =>{
            expect(response.body.message).to.equal("Registro excluído com sucesso")
            expect(response.status).to.equal(200)
        })
       }) 
    });


});
