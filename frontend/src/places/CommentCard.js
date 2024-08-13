import { useContext } from 'react';
import { CurrentUser } from '../contexts/CurrentUser'

function CommentCard({ comment, onDelete }) {
    const author = comment.author || {};

    const { currentUser } = useContext(CurrentUser)

    let deleteButton = null;

    if (currentUser?.userId === comment.authorId) {
        deleteButton = (
            <button className="btn btn-danger" onClick={onDelete} >
                Delete Comment
            </button>
        )
    }

    return (
        <div className="border col-sm-4">
            <h2 className="rant">{comment.rant ? 'Rant! 😡' : 'Rave! 😻'}</h2>
            <h3>{comment.content}</h3>
            <h4>Rating: {comment.stars}</h4>
            <h4>Author: {author.firstName} {author.lastName}</h4> {}
            {deleteButton}
        </div>
    )
}

export default CommentCard;
