# NC news

Northcoders news API

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites and Dependencies

- node.js
- postgres sql
- npm express package
- knex
- mocha
- chai
- supertest
- sams-chai-sorted

### Installing

1,open your your termial and run the following command into your desired folder:

```
git clone https:github.com/<github-username>/be-nc-news

```

2,open the file using your code editor and install the dependencies needed for the project above

```
eg, npm install mocha chai...
```

## Running the tests

Familiarise yourself with test 'scripts', based in the package.json file. I reccommend having a look in the knex docs.

### Break down into end to end tests

Testing has been carried out on each api route and the functions used to manipulate the data.

```
GET /api/articles
```

run 'npm test' in your command line to run the test suite

### What I tested for?

Each tests are to make sure methods and responses are to allowed and sent back in the correct format.

eg, GET /api/topics: would return with a json object with the key of the requested endpoint

```
{
  "topics": [
    {
      "description": "Code is love, code is life",
      "slug": "coding"
    },
    {
      "description": "FOOTIE!",
      "slug": "football"
    },
    {
      "description": "Hey good looking, what you got cooking?",
      "slug": "cooking"
    }
  ]
}

```

## Deployment

This app can be deployed to heroku

## Authors

- **Tommy Diep** - _Initial work_ - [PurpleBooth](https://github.com/TommyDi23/nc_news)

## Acknowledgments

- Northcoders
