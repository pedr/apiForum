
const { Post, User, Thread } = require('../db/index.js');
const router = require('express').Router();

router.post('/threads', (req, res) => {
    const { authorId, content } = req.body;
    const thread = new Thread({ authorId, content });
    thread.save()
        .then(resp => {
            console.log(resp);
        })
        .catch(e => {
            console.error(e);
            res.sendStatus(400);
        })
    res.send();
})

router.get('/threads/:id', (req, res) => {
    const { id } = req.params;
    const thread = new Thread({ id });
    thread.loadInfo()
        .then( () => thread.getPosts())
        .then( () => res.json(thread))
        .catch( e => {
            console.error(e);
            res.sendStatus(400);
        });
})

router.post('/posts', (req, res) => {
    const { content, userId, threadId } = req.body;
    const post = new Post({ content, userId, threadId });
    post.save()
        .then(resp => {
            console.log(post);
        })
        .catch(e => {
            console.error(e);
            res.sendStatus(400);
        })
    res.send();
});

router.post('/users', (req, res) => {
    const { nickname, password } = req.body;
    const user = new User( {nickname, password });
    user.save()
        .then((resp) => {
            console.log(user);
        })
        .catch( e => {
            console.error(e);
            res.sendStatus(400);
        });
    res.send();
});

module.exports = router;