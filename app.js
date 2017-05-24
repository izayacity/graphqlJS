import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLID,
    GraphQLBoolean,
    GraphQLFloat
} from 'graphql';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var axios = require('axios');

// https://api.github.com/users/apaquino
const UserInfoType = new GraphQLObjectType({
    name: "UserInfo",
    description: "Basic information on a GitHub user",
    fields: () => ({
        "login":                { type: GraphQLString },
        "id":                   { type: GraphQLInt },
        "avatar_url":           { type: GraphQLString },
        "site_admin":           { type: GraphQLBoolean },
        "url":                  { type: GraphQLString },
        "html_url":             { type: GraphQLString },
        "followers_url":        { type: GraphQLString },
        "gists_url":            { type: GraphQLString },
        "starred_url":          { type: GraphQLString },
        "subscriptions_url":    { type: GraphQLString },
        "organizations_url":    { type: GraphQLString },
        "repos_url":            { type: GraphQLString },
        "events_url":           { type: GraphQLString },
        "received_events_url":  { type: GraphQLString },
        "type":                 { type: GraphQLString },
        "site_admin":           { type: GraphQLBoolean },
        "name":                 { type: GraphQLString },
        "company":              { type: GraphQLString },
        "blog":                 { type: GraphQLString },
        "location":             { type: GraphQLString },
        "email":                { type: GraphQLString },
        "hireable":             { type: GraphQLString },
        "bio":                  { type: GraphQLString },
        "public_repos":         { type: GraphQLInt },
        "public_gists":         { type: GraphQLInt },
        "followers":            { type: GraphQLInt },
        "following":            { type: GraphQLInt },
        "created_at":           { type: GraphQLString },
        "updated_at":           { type: GraphQLString },
        "following_url": {
            type: GraphQLString,
            resolve: (obj) => {
                const brackIndex = obj.following_url.indexOf("{");
                return obj.following_url.slice(0, brackIndex);
            }
        }
    })
});

const query = new GraphQLObjectType({
    name: "Query",
    description: "First GraphQL Server Config — Yay!",
    fields: () => ({
        gitHubUser: {
            type: UserInfoType,
            description: "GitHub user API data with enhanced and additional data",
            args: {
                username: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: "The GitHub user login you want information on",
                },
            },
            resolve: (_,{username}) => {
                const url = `https://api.github.com/users/${username}`;
                return axios.get(url).then(function(response) {
                    return response.data;
                });
            }
        },
    })
});

const schema = new GraphQLSchema({
    query
});
export default schema;

var root = { hello: () => 'Hello world!' };

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/graphql', graphqlHTTP({
    schema: schema,
    //rootValue: root,
    graphiql: true,
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
