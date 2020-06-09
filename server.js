const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT);
const io = require("socket.io").listen(server);
const Twit = require("twit");
const config = require("./config");

// Twitter API setup.
const T = new Twit(config);

async function getTweets() {
    // Returns last five tweets from my personal account.
    let tweets = [];

    await T.get("statuses/user_timeline", { screen_name: "mauricefcost",
                                            count: 5, exclude_replies: true })
        .then(function(result) {
            const data = result.data;
            for(let i = 0; i < data.length; i++) {
                const tweet = {
                    text: data[i].text,
                    userHandle: data[i].user.screen_name,
                    profileImageUrl: data[i].user.profile_image_url
                };
                tweets.push(tweet);
            }

        }).catch(function(error) {
            console.log(`I found an error: ${error}`);
        });

    return tweets;
}

// Setting up our template/view engine.
app.engine("hbs", exphbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials"
}));
app.set("view engine", "hbs");

// Setting the path to the templates (views).
app.set("views", path.join(__dirname, "./views"));

// Serving static files directly from public (no routing).
app.use(express.static(path.join("public")));

// Setting up the only route that I need.
const router = express.Router();
router.get("/", async (request, response, next) => {
    const tweets = await getTweets();
    response.render("portfolio", { tweets });
});

router.get("/favicon.ico", (request, response, next) => {
    return response.sendStatus(204); // Empty response
});

app.use("/", router);

// Listening to socket events.
io.sockets.on("connection", (socket) => {
    // console.log("new connection: " + socket.id);

    // Listens to the 'mouse' event.
    socket.on("mouse", (data) => {
        socket.broadcast.emit("mouse", data);
    });
});
