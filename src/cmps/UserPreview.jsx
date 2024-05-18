export function UserPreview({ user }) {
  return (
    <article>
      <h4>{user.username}</h4>
      {/* <h4>{user._id}</h4> */}

      <p>
        Score: <span>{user.score}</span>
      </p>
    </article>
  );
}
