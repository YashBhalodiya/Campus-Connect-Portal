import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ArrowLeft, FileText, ExternalLink, Edit, Trash2, ThumbsUp, MessageSquare } from 'lucide-react';
import { resourcesAPI } from '../lib/api';
import { formatDateTime } from '../lib/utils';
import { isAuthenticated, getCurrentUser } from '../lib/auth';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import TextArea from '../components/common/TextArea';
import Loader from '../components/common/Loader';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';

type CommentFormData = {
  text: string;
};

const ResourceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const authenticated = isAuthenticated();
  const currentUser = getCurrentUser();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentFormData>();
  
  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        const response = await resourcesAPI.getById(id as string);
        setResource(response.data);
      } catch (error) {
        console.error('Error fetching resource:', error);
        toast.error('Failed to load resource');
        navigate('/resources');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResource();
  }, [id, navigate]);
  
  // Check if the current user is the author or admin
  const isAuthor = currentUser && resource?.uploadedBy?._id === currentUser.id;
  const canEdit = isAuthor || (currentUser?.role === 'admin');
  
  // Check if the current user has liked the resource
  const hasLiked = currentUser && resource?.likes?.some((like: any) => like._id === currentUser.id);
  
  const handleLike = async () => {
    if (!authenticated) {
      toast.error('Please log in to like resources');
      return;
    }
    
    try {
      const response = await resourcesAPI.toggleLike(id as string);
      setResource(response.data);
      // Check if liked or unliked
      const isLiked = response.data.likes.some((like: any) => like._id === currentUser?.id);
      toast.success(isLiked ? 'Resource liked!' : 'Like removed');
    } catch (error) {
      console.error('Error liking resource:', error);
      toast.error('Failed to like resource');
    }
  };
  
  const onCommentSubmit = async (data: CommentFormData) => {
    if (!authenticated) {
      toast.error('Please log in to comment');
      return;
    }
    
    try {
      setSubmitting(true);
      const response = await resourcesAPI.addComment(id as string, data.text);
      setResource(response.data);
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
      toast.error('You do not have permission to delete this resource');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        setDeleting(true);
        await resourcesAPI.delete(id as string);
        toast.success('Resource deleted!');
        navigate('/resources');
      } catch (error) {
        console.error('Error deleting resource:', error);
        toast.error('Failed to delete resource');
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
  
  if (!resource) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Resource not found</h2>
        <Link to="/resources">
          <Button>Back to Resources</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <Link to="/resources" className="text-blue-600 hover:text-blue-800 flex items-center">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Resources
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-blue-50 p-6 border-b border-blue-100">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{resource.title}</h1>
            <Badge variant="primary">{resource.category}</Badge>
          </div>
          
          <div className="flex items-center">
            <Avatar 
              name={resource.uploadedBy?.name || 'User'} 
              size="md" 
            />
            <div className="ml-3">
              <p className="font-medium">{resource.uploadedBy?.name}</p>
              <p className="text-sm text-gray-500">
                Uploaded on {formatDateTime(resource.createdAt)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {canEdit && (
            <div className="flex justify-end mb-6 space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/resources/${id}/edit`)}
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
          
          <div className="prose max-w-none mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 whitespace-pre-line">{resource.description}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              <FileText className="inline-block mr-2 h-5 w-5 text-blue-600" />
              Resource File
            </h3>
            <a 
              href={resource.fileUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mt-2 inline-flex items-center"
            >
              <Button className="flex items-center">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Resource
              </Button>
            </a>
          </div>
          
          <div className="flex items-center justify-between border-t pt-4 mt-4">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                disabled={!authenticated}
                className={`flex items-center text-gray-500 hover:text-blue-600 transition-colors ${
                  hasLiked ? 'text-blue-600' : ''
                }`}
              >
                <ThumbsUp className="mr-1 h-5 w-5" />
                <span>{resource.likes?.length || 0} Likes</span>
              </button>
              <div className="flex items-center text-gray-500">
                <MessageSquare className="mr-1 h-5 w-5" />
                <span>{resource.comments?.length || 0} Comments</span>
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
              <p className="text-gray-700 mb-2">Sign in to comment on this resource</p>
              <Link to="/login">
                <Button>Sign In</Button>
              </Link>
            </Card.Content>
          </Card>
        )}
        
        {resource.comments && resource.comments.length > 0 ? (
          <div className="space-y-4">
            {resource.comments.map((comment: any) => (
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

export default ResourceDetailPage;