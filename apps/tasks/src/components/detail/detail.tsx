import { Link } from 'react-router-dom';

export function Detail() {
  return (
    <div>
      <h1>Task detail</h1>
      <br />
      <Link to="/tasks">Back to List</Link>
    </div>
  );
}

export default Detail;
