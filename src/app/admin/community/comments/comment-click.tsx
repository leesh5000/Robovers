// 댓글 클릭 시 커뮤니티 페이지로 이동하는 기능
// 이 파일은 댓글 하이라이팅 기능을 위한 코드 조각입니다

export const handleCommentClick = (postId: string, commentId: string) => {
  window.location.href = `/community/${postId}?commentId=${commentId}`;
};