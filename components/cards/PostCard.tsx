interface CardProps {
    id: string;
    currentUserId: string;
    parentId: string; null;
    content: string,
    author: {
        name: string;
        id: string;
        image: string;
    } | null;
    createdAt: string;
    comments: {
        author: {
            image: string;
        }
    }[]
    isComment?
    : boolean;
}

const PostCard = ({ id, currentUserId, parentId, content, author, createdAt, comments }: CardProps) => {
    return (
        <article>
            <h2 className="text-small-regular text-light-2">
                {content}
            </h2>
        </article>
    )

}

export default PostCard;