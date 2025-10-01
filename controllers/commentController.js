const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

async function getComment(req, res) {
  const comment = await prisma.comment.findFirst({
    where: {
      id: Number(req.params.id),
    },
  });

  return res.json({ comment });
}

// async function getComments(req, res) {
//   const comments = await prisma.comment.findMany({
//     where: {
//       isActive: true,
//     },
//     orderBy: {
//       created_at: "desc",
//     },
//   });

//   return res.json({ comments });
// }

async function getComments(req, res) {
  let comments = [];
  if (req.query.postId) {
    const postId = Number(req.query.postId);

    comments = await prisma.comment.findMany({
      where: {
        isActive: true,
        AND: {
          postId: postId,
        },
      },
      orderBy: {
        created_at: "desc",
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
  } else {
    comments = await prisma.comment.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        created_at: "desc",
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
  }

  return res.json({ comments });
}

async function createComment(req, res, next) {
  try {
    const comment = {
      comment: req.body.comment,
      postId: parseInt(req.body.postId),
      userId: parseInt(req.body.userId),
    };

    const Comment = await prisma.comment.create({
      data: comment,
    });

    return res.json({ comment: Comment });
  } catch (err) {
    next(err);
  }
}

async function updateComment(req, res, next) {
  try {
    req.params.id = parseInt(req.params.id);

    let comment = {};
    for (const [key, value] of Object.entries(req.body)) {
      if (value === "") {
        continue;
      } else {
        comment[key] = value;
      }
    }

    const Comment = await prisma.comment.update({
      where: {
        id: req.params.id,
      },
      data: comment,
    });

    return res.json({ Comment });
  } catch (err) {
    next(err);
  }
}

async function deleteComment(req, res, next) {
  const id = Number(req.params.id);

  const comment = await prisma.comment.update({
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
    comment,
  });
}

module.exports = {
  getComment,
  getComments,
  createComment,
  updateComment,
  deleteComment,
};
