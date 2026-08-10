import {test, expect} from '@playwright/test'
import * as allure from 'allure-js-commons'

let auth_token: string
test.beforeAll("Get Token", async({request}) => {
    const token = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {"user":{"email":"conduit_1@gmail.com","password":"conduit_1"}}
    })
    const token_json = await token.json()
    auth_token = 'Token' +' '+ token_json.user.token
})

test("Get Articles", async({request}) => {
    await allure.epic('API Automation')
    await allure.feature('Articles API')
    await allure.story('Get Articles')

    const requestArticles = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
    await expect(requestArticles.status(), 'Get Article Status Check').toBe(200)
})

test("Get Tags", async({request}) => {
    await allure.epic('API Automation')
    await allure.feature('Articles API')
    await allure.story('Get Tags')
    const requestTags = await request.get('https://conduit-api.bondaracademy.com/api/tags')
    await expect(requestTags.status(), 'Get Tags Status Check').toBe(200)
})


test('CRUD operation', async({request}) => {
    await allure.epic('API Automation')
    await allure.feature('Articles API')
    await allure.story('CRUD Operation')

    const create_article = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: {"article":{"title":"Testing","description":"Testing","body":"Testing","tagList":["Testing"]}},
        headers: {Authorization: `${auth_token}`}
    })
    await expect(create_article.status()).toBe(201)
    const create_article_json = await create_article.json()
    const created_slug_id = create_article_json.article.slug

    const update_article = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${created_slug_id}`, {
        data: {"article":{"title":"TestingUpd","description":"TestingUpd","body":"TestingUpd","tagList":["testing"],"slug":`${created_slug_id}`}},
        headers: {Authorization: `${auth_token}`}
    })
    await expect(update_article.status()).toBe(200)
    const update_article_json = await update_article.json()
    const updated_slug_id = update_article_json.article.slug
    const delete_article = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${updated_slug_id}`, {
        data: {"article":{"title":"TestingUpd","description":"TestingUpd","body":"TestingUpd","tagList":["testing"],"slug":`${created_slug_id}`}},
        headers: {Authorization: `${auth_token}`}
    })
    await expect(delete_article.status()).toBe(204)

    const requestArticles = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
        headers: {Authorization: `${auth_token}`}
    })
    await expect(requestArticles.status()).toBe(200)
    
    // validating that SlugID is not present in the ARRAY
    const requestArticles_json = await requestArticles.json()
    await expect(requestArticles_json.articles[0].slug).not.toContain(`${updated_slug_id}`)

    // One more way checking that SlugID is not present in the ARRAY. Using Map
    const slugs = requestArticles_json.articles.map(a => a.slug);
    await expect(slugs).not.toContain(`${updated_slug_id}`)
})
