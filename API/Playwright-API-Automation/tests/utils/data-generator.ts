import articleRequestPayload from '../request-objects/POST-article.json'
import articleUpdatePayload from '../request-objects/PUT-article.json'
import {faker} from '@faker-js/faker'

export function getNewRandomArticle() {
    const articleRequest = JSON.parse(JSON.stringify(articleRequestPayload))
    articleRequest.article.title = faker.lorem.sentence(5)
    articleRequest.article.description = faker.lorem.sentence(3)
    articleRequest.article.body = faker.lorem.paragraph(8)
    return articleRequest
}