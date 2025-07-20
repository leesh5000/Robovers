'use client';

export default function CreatePostButton() {
  const handleClick = () => {
    // TODO: 글쓰기 모달 또는 페이지로 이동
    alert('글쓰기 기능은 준비 중입니다!');
  };

  return (
    <>
      {/* 데스크톱 버튼 */}
      <button
        onClick={handleClick}
        className="hidden md:flex fixed bottom-8 right-8 items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 group"
      >
        <svg
          className="w-5 h-5 transition-transform group-hover:rotate-90"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span className="font-medium">새 글 작성</span>
      </button>

      {/* 모바일 플로팅 버튼 */}
      <button
        onClick={handleClick}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
        aria-label="새 글 작성"
      >
        <svg
          className="w-6 h-6 transition-transform group-hover:rotate-90"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </>
  );
}