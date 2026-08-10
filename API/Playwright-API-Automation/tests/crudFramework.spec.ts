import { createToken } from './helpers/createToken'
import { test } from './utils/fixtures'
import {expect} from '@playwright/test'
import articleRequestPayload from './request-objects/POST-article.json'
import articleUpdatePayload from './request-objects/PUT-article.json'
import { getNewRandomArticle } from './utils/data-generator'
import * as allure from 'allure-js-commons'



// Auth Token Generation
let auth_token: string
test.beforeAll("Get Token", async ({ config }) => {
    auth_token = await createToken(config.userEmail, config.userPassword)
})

// Get Articles without Token
test('Get Articles', async ({ api }) => {
    await allure.epic('API Automation')
    await allure.feature('Articles API')
    await allure.story('Get Articles')

    const response = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 }) // bcoz we have declared it as an object
        .getRequest(200, 'Get Article')

    expect(response.articles.length,'Verify length of the Article is less than 10').toBeLessThanOrEqual(10)
    expect(response.articlesCount,'Verify count of the Article is 10').toEqual(10)
})

// Get Tags without Token
test('Get Tags', async ({ api }) => {
    await allure.epic('API Automation')
    await allure.feature('Tags API')
    await allure.story('Get Tags')    

    const response = await api
        .path('/tags')
        .getRequest(200, 'Get Tags')

    expect(response.tags[0],'Verify first is Test').toEqual('Test')
    expect(response.tags.length,'Verify count of tags is less than 10').toBeLessThanOrEqual(10)
})


// Create and Delete Articles with Token
test('Create and Delete Article', async ({ api }) => {
    await allure.epic('API Automation')
    await allure.feature('Create And Delete Articles API')
    await allure.story('Create/Delete Articles')

    const articleRequest = getNewRandomArticle()
    const create_article_json = await api
        .path('/articles/')
        .body(articleRequest)
        .headers({ Authorization: `${auth_token}` })
        .postRequest(201, 'Create Article')
    await expect(create_article_json.article.title,'Verify Article Created in the Response').toEqual(articleRequest.article.title)
    const created_slug_id = create_article_json.article.slug

    const requestCreateArticles_json = await api
        .path('/articles?limit=10&offset=0')
        .headers({ Authorization: `${auth_token}` })
        .getRequest(200, 'Validate Article Created')
    let slugs = requestCreateArticles_json.articles.map(a => a.slug);
    await expect(slugs,'Verify Article Created by Get Articles').toContain(`${created_slug_id}`)
    await expect(requestCreateArticles_json.articles[0].title, 'Verify Created Article Title').toEqual(articleRequest.article.title)

    await api
        .path(`/articles/${created_slug_id}`)
        .headers({ Authorization: `${auth_token}` })
        .deleteRequest(204, 'Delete Created Article')

    const requestDeleteArticles_json = await api
        .path('/articles?limit=10&offset=0')
        .headers({ Authorization: `${auth_token}` })
        .getRequest(200,'Validate Article deleted')
    slugs = requestDeleteArticles_json.articles.map(a => a.slug);
    await expect(slugs,'Verify article deleted by SlugId').not.toContain(`${created_slug_id}`)
    await expect(requestDeleteArticles_json.articles[0].title,'Verify Deleted Article Title').not.toEqual(articleRequest.article.title)

})


// Create;Update and Delete Articles with Token
test('Create, Update and Delete Article', async ({ api }) => {
    await allure.epic('API Automation')
    await allure.feature('Create, Update And Delete Articles API')
    await allure.story('Create/Update/Delete Articles')

    const articleRequest = JSON.parse(JSON.stringify(articleRequestPayload))
    articleRequest.article.title = 'This is a CRUD object title'
    const create_article_json = await api
        .path('/articles/')
        .body(articleRequest)
        .headers({ Authorization: `${auth_token}` })
        .postRequest(201, `Create Article ${articleRequest.article.title}`)
    await expect(create_article_json.article.title,'Verify Article Created in the Response').toEqual('This is a CRUD object title')
    const created_slug_id = create_article_json.article.slug

    const requestCreateArticles_json = await api
        .path('/articles?limit=10&offset=0')
        .headers({ Authorization: `${auth_token}` })
        .getRequest(200, `Validate Created Article ${articleRequest.article.title} created`)
    let slugs = requestCreateArticles_json.articles.map(a => a.slug);
    await expect(slugs,'Verify Article Created by Get Articles').toContain(`${created_slug_id}`)
    await expect(requestCreateArticles_json.articles[0].title, 'Verify Created Article Title').toEqual('This is a CRUD object title')


    const updateArticleRequest = JSON.parse(JSON.stringify(articleUpdatePayload))
    updateArticleRequest.article.slug = `${created_slug_id}`
    const update_article_json = await api
        .path(`/articles/${created_slug_id}`)
        .body(updateArticleRequest)
        .headers({ Authorization: `${auth_token}` })
        .putRequest(200, 'Update Article')
    const updated_slug_id = update_article_json.article.slug

    const requestUpdateArticles_json = await api
        .path('/articles?limit=10&offset=0')
        .headers({ Authorization: `${auth_token}` })
        .getRequest(200, 'Validate Article Updated')
    slugs = requestUpdateArticles_json.articles.map(a => a.slug);
    await expect(slugs, "Verify new SlugId updated in the Update Response").toContain(`${updated_slug_id}`)
    await expect(requestUpdateArticles_json.articles[0].title, "Verify title in the Update Response").toEqual('TestingUpd')

    await api
        .path(`/articles/${updated_slug_id}`)
        .headers({ Authorization: `${auth_token}` })
        .deleteRequest(204, `Delete Article ${updated_slug_id}`)

    const requestDeleteArticles_json = await api
        .path('/articles?limit=10&offset=0')
        .headers({ Authorization: `${auth_token}` })
        .getRequest(200, 'Validate Article Deleted')
    slugs = requestDeleteArticles_json.articles.map(a => a.slug);
    await expect(slugs,'Verify article deleted by SlugId').not.toContain(`${updated_slug_id}`)
    await expect(requestDeleteArticles_json.articles[0].title,'Verify Deleted Article Title').not.toEqual('TestingUpd')

})


