const bcrypt = require("bcryptjs");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

async function getPost(req, res) {
  const post = await prisma.post.findFirst({
    where: {
      id: Number(req.params.id),
    },
  });

  return res.json({ post });
}

async function getPosts(req, res) {
  const posts = await prisma.post.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return res.json({ posts });
}

async function createPost(req, res, next) {
  try {
    const post = {
      title: req.body.title,
      body: req.body.body,
      authorId: parseInt(req.body.authorId),
      isPublished: req.body.isPublished === "true",
    };

    const Post = await prisma.post.create({
      data: post,
    });

    return res.json({ post: Post });
  } catch (err) {
    next(err);
  }
}

async function updatePost(req, res, next) {
  try {
    req.params.id = parseInt(req.params.id);
    req.body.isPublished = req.body.isPublished === "true";

    let post = {};
    for (const [key, value] of Object.entries(req.body)) {
      if (value === "") {
        continue;
      } else {
        post[key] = value;
      }
    }

    const Post = await prisma.post.update({
      where: {
        id: req.params.id,
      },
      data: post,
    });

    return res.json({ Post });
  } catch (err) {
    next(err);
  }
}

async function deletePost(req, res, next) {
  const id = Number(req.params.id);

  const post = await prisma.post.update({
    where: {
      id: id,
      AND: {
        isActive: true,
      },
    },
    data: {
      isActive: false,
    },
  });

  return res.json({
    post,
  });
}

module.exports = {
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
};
