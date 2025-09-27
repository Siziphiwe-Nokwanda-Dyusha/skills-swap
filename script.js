 const STUDENT_NUMBER = 7;
  const SITE_ID = 'library';

  // Keep a local array of comments
  let localComments = [];

  loadComments();

  async function loadComments() {
    try {
      document.getElementById('comments').innerHTML =
        '<div class="loading">Loading comments...</div>';
      document.getElementById('error').innerHTML = '';

      localComments = await getComments(STUDENT_NUMBER, SITE_ID);

      renderComments();
    } catch (error) {
      document.getElementById('error').innerHTML =
        `<div class="error">Error loading comments: ${error.message}</div>`;
      document.getElementById('comments').innerHTML = '';
    }
  }

  function renderComments() {
    if (localComments.length === 0) {
      document.getElementById('comments').innerHTML =
        '<p>No comments yet. Be the first to comment!</p>';
      return;
    }

    const html = localComments.map(comment => `
      <div class="comment" data-id="${comment.id}">
        <div class="comment-header">
          <div class="comment-meta">
            <strong>${comment.sender || 'Anonymous'}</strong> - 
            ${new Date(comment.ts).toLocaleString()}
          </div>
          <button class="delete-btn" onclick="removeComment('${comment.id}')">Delete</button>
        </div>
        <div>${comment.text}</div>
      </div>
    `).join('');

    document.getElementById('comments').innerHTML = html;
  }

  async function addComment() {
    const commentText = document.getElementById('commentText').value.trim();

    if (!commentText) {
      document.getElementById('error').innerHTML =
        '<div class="error">Please enter a comment</div>';
      return;
    }

    try {
      document.getElementById('error').innerHTML = '';

      // Post comment and get the returned JSON
      const newComment = await postComment(STUDENT_NUMBER, SITE_ID, commentText, "Me");

      // Clear textarea
      document.getElementById('commentText').value = '';

      // Optimistically add to local comments & render immediately
      localComments.unshift(newComment);
      renderComments();

    } catch (error) {
      document.getElementById('error').innerHTML =
        `<div class="error">Error posting comment: ${error.message}</div>`;
    }
  }

  async function removeComment(commentId) {
    try {
      document.getElementById('error').innerHTML = '';

      await deleteComment(STUDENT_NUMBER, SITE_ID, commentId);

      // Remove from local array and re-render without a reload
      localComments = localComments.filter(c => c.id !== commentId);
      renderComments();

    } catch (error) {
      document.getElementById('error').innerHTML =
        `<div class="error">Error deleting comment: ${error.message}</div>`;
    }
  }
