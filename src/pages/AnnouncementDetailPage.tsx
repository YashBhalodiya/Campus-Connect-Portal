import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { MessageSquare, ThumbsUp, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { announcementsAPI } from '../lib/api';
import { formatDateTime } from '../lib/utils';
import { isAuthenticated, getCurrentUser } from '../lib/auth';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import TextArea from '../components/common/TextArea';
import Loader from '../components/common/Loader';
import Avatar from '../components/common/Avatar';

type CommentFormData = {
  text: string;
};

const AnnouncementDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const authenticated = isAuthenticated();
  const currentUser = getCurrentUser();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentFormData>();
  
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setLoading(true);
        const response = await announcementsAPI.getById(id as string);
        setAnnouncement(response.data);
      } catch (error) {
        console.error('Error fetching announcement:', error);
        toast.error('Failed to load announcement');
        navigate('/announcements');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnnouncement();
  }, [id, navigate]);
  
  // Check if the current user is the author or admin
  const isAuthor = currentUser && announcement?.createdBy?._id === currentUser.id;
  const canEdit = isAuthor || (currentUser?.role === 'admin');
  
  const handleLike = async () => {
    if (!authenticated) {
      toast.error('Please log in to like announcements');
      return;
    }
    
    try {
      const response = await announcementsAPI.toggleLike(id as string);
      setAnnouncement(response.data);
      // Check if liked or unliked
      const isLiked = response.data.likes.some((like: any) => like._id === currentUser?.id);
      toast.success(isLiked ? 'Announcement liked!' : 'Like removed');
    } catch (error) {
      console.error('Error liking announcement:', error);
      toast.error('Failed to like announcement');
    }
  };
  
  const onCommentSubmit = async (data: CommentFormData) => {
    if (!authenticated) {
      toast.error('Please log in to comment');
      return;
    }
    
    try {
      setSubmitting(true);
      const response = await announcementsAPI.addComment(id as string, data.text);
      setAnnouncement(response.data);
      reset();
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    if (!canEdit) {
      toast.error('You do not have permission to delete this announcement');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        setDeleting(true);
        await announcementsAPI.delete(id as string);
        toast.success('Announcement deleted!');
        navigate('/announcements');
      } catch (error) {
        console.error('Error deleting announcement:', error);
        toast.error('Failed to delete announcement');
      } finally {
        setDeleting(false);
      }
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader size="lg" />
      </div>
    );
  }
  
  if (!announcement) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Announcement not found</h2>
        <Link to="/announcements">
          <Button>Back to Announcements</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <Link to="/announcements" className="text-blue-600 hover:text-blue-800 flex items-center">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Announcements
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{announcement.title}</h1>
            {canEdit && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/announcements/${id}/edit`)}
                  className="flex items-center"
                >
                  <Edit className="mr-1 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDelete}
                  isLoading={deleting}
                  className="flex items-center"
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex items-center mb-6">
            <Avatar name={announcement.createdBy?.name || 'User'} size="md" />
            <div className="ml-3">
              <p className="font-medium">{announcement.createdBy?.name}</p>
              <p className="text-sm text-gray-500">
                Posted on {formatDateTime(announcement.createdAt)}
              </p>
            </div>
          </div>
          
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 whitespace-pre-line">{announcement.description}</p>
          </div>
          
          <div className="flex items-center justify-between border-t pt-4 mt-4">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                disabled={!authenticated}
                className={`flex items-center text-gray-500 hover:text-blue-600 transition-colors ${
                  announcement.likes?.includes(currentUser?.id) ? 'text-blue-600' : ''
                }`}
              >
                <ThumbsUp className="mr-1 h-5 w-5" />
                <span>{announcement.likes?.length || 0} Likes</span>
              </button>
              <div className="flex items-center text-gray-500">
                <MessageSquare className="mr-1 h-5 w-5" />
                <span>{announcement.comments?.length || 0} Comments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Comments</h2>
        
        {authenticated ? (
          <Card className="mb-6">
            <Card.Content>
              <form onSubmit={handleSubmit(onCommentSubmit)}>
                <TextArea
                  id="comment"
                  placeholder="Write a comment..."
                  error={errors.text?.message}
                  disabled={submitting}
                  {...register('text', { required: 'Comment text is required' })}
                />
                <div className="mt-3 flex justify-end">
                  <Button type="submit" isLoading={submitting}>
                    Post Comment
                  </Button>
                </div>
              </form>
            </Card.Content>
          </Card>
        ) : (
          <Card className="mb-6 bg-gray-50">
            <Card.Content className="text-center py-4">
              <p className="text-gray-700 mb-2">Sign in to comment on this announcement</p>
              <Link to="/login">
                <Button>Sign In</Button>
              </Link>
            </Card.Content>
          </Card>
        )}
        
        {announcement.comments && announcement.comments.length > 0 ? (
          <div className="space-y-4">
            {announcement.comments.map((comment: any) => (
              <Card key={comment._id} className="bg-gray-50">
                <Card.Content>
                  <div className="flex items-start">
                    <Avatar 
                      name={comment.createdBy?.name || 'User'} 
                      size="sm" 
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{comment.createdBy?.name}</p>
                          <p className="text-xs text-gray-500">
                            {formatDateTime(comment.createdAt)}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-700">{comment.text}</p>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementDetailPage;