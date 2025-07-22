import { Router } from "express";
import Comment from "../models/comments.model.js";

const router = Router({ mergeParams: true });

router.get('/', async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ post: postId }).sort({ _id: -1 });
  res.json(comments);
});

router.post('/', async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "내용을 입력하세요." });
  }

  const comment = await Comment.create({ content, post: postId });
  res.status(201).json(comment);
});

router.put('/:commentId', async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const comment = await Comment.findByIdAndUpdate(
    commentId,
    { content },
    { new: true }
  );
  if (!comment) {
    return res.status(404).json({ error: "댓글이 없습니다." });
  }
  res.json(comment);
});

// 댓글 삭제 (DELETE /posts/:postId/comments/:commentId)
router.delete('/:commentId', async (req, res) => {
  const { commentId } = req.params;
  const result = await Comment.findByIdAndDelete(commentId);
  if (!result) {
    return res.status(404).json({ error: "댓글이 없습니다." });
  }
  res.status(204).send();
});

export default router;
