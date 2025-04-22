import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ArrowLeft, Calendar, MapPin, Users, Edit, Trash2, MessageSquare } from 'lucide-react';
import { eventsAPI } from '../lib/api';
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

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const authenticated = isAuthenticated();
  const currentUser = getCurrentUser();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentFormData>();
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await eventsAPI.getById(id as string);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event');
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [id, navigate]);
  
  // Check if the current user is the author or admin
  const isAuthor = currentUser && event?.createdBy?._id === currentUser.id;
  const canEdit = isAuthor || (currentUser?.role === 'admin');
  
  // Check if the current user is registered for the event
  const isRegistered = currentUser && event?.registeredUsers?.some(
    (user: any) => user._id === currentUser.id
  );
  
  // Check if the event is full
  const isEventFull = event?.registrationLimit > 0 && 
    event?.registeredUsers?.length >= event?.registrationLimit;
  
  // Check if the event is in the past
  const isEventPast = event ? new Date(event.date) < new Date() : false;
  
  const handleRegister = async () => {
    if (!authenticated) {
      toast.error('Please log in to register for events');
      return;
    }
    
    try {
      setRegistering(true);
      await eventsAPI.register(id as string);
      toast.success('Successfully registered for event!');
      // Refresh event data
      const response = await eventsAPI.getById(id as string);
      setEvent(response.data);
    } catch (error: any) {
      console.error('Error registering for event:', error);
      toast.error(error.response?.data?.message || 'Failed to register for event');
    } finally {
      setRegistering(false);
    }
  };
  
  const handleCancelRegistration = async () => {
    if (!authenticated) {
      return;
    }
    
    try {
      setRegistering(true);
      await eventsAPI.cancelRegistration(id as string);
      toast.success('Registration cancelled');
      // Refresh event data
      const response = await eventsAPI.getById(id as string);
      setEvent(response.data);
    } catch (error: any) {
      console.error('Error cancelling registration:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel registration');
    } finally {
      setRegistering(false);
    }
  };
  
  const onCommentSubmit = async (data: CommentFormData) => {
    if (!authenticated) {
      toast.error('Please log in to comment');
      return;
    }
    
    try {
      setSubmitting(true);
      const response = await eventsAPI.addComment(id as string, data.text);
      setEvent(response.data);
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
      toast.error('You do not have permission to delete this event');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        setDeleting(true);
        await eventsAPI.delete(id as string);
        toast.success('Event deleted!');
        navigate('/events');
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event');
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
  
  if (!event) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h2>
        <Link to="/events">
          <Button>Back to Events</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <Link to="/events" className="text-blue-600 hover:text-blue-800 flex items-center">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Events
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-blue-600 text-white p-6">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold">{event.title}</h1>
            <Badge variant={isEventPast ? 'secondary' : 'success'}>
              {isEventPast ? 'Past Event' : 'Upcoming Event'}
            </Badge>
          </div>
          <p className="mt-2 opacity-90">Organized by {event.createdBy?.name}</p>
        </div>
        
        <div className="p-6">
          {canEdit && (
            <div className="flex justify-end mb-4 space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/events/${id}/edit`)}
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Date and Time</p>
                <p className="font-medium">{formatDateTime(event.date)}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <MapPin className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{event.location}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Users className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Attendees</p>
                <p className="font-medium">
                  {event.registeredUsers?.length || 0}
                  {event.registrationLimit > 0 && ` / ${event.registrationLimit}`}
                </p>
              </div>
            </div>
          </div>
          
          <div className="prose max-w-none mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">About this event</h3>
            <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
          </div>
          
          {!isEventPast && (
            <div className="bg-gray-50 p-4 rounded-lg mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Registration</h3>
              
              {!authenticated ? (
                <div>
                  <p className="text-gray-700 mb-3">Please log in to register for this event.</p>
                  <Link to="/login">
                    <Button>Sign In</Button>
                  </Link>
                </div>
              ) : isRegistered ? (
                <div>
                  <p className="text-green-600 font-medium mb-3">You are registered for this event!</p>
                  <Button 
                    variant="outline"
                    onClick={handleCancelRegistration}
                    isLoading={registering}
                  >
                    Cancel Registration
                  </Button>
                </div>
              ) : isEventFull ? (
                <p className="text-red-600 font-medium">This event has reached its registration limit.</p>
              ) : (
                <div>
                  <p className="text-gray-700 mb-3">
                    {event.registrationLimit > 0 ? (
                      <>Spots available: {event.registrationLimit - (event.registeredUsers?.length || 0)}</>
                    ) : (
                      'Registration is open for this event.'
                    )}
                  </p>
                  <Button 
                    onClick={handleRegister}
                    isLoading={registering}
                  >
                    Register Now
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {event.registeredUsers && event.registeredUsers.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Attendees</h3>
              <div className="flex flex-wrap gap-2">
                {event.registeredUsers.map((user: any) => (
                  <div key={user._id} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                    <Avatar name={user.name} size="xs" />
                    <span className="ml-2 text-sm">{user.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          <MessageSquare className="inline-block mr-2 h-5 w-5" />
          Comments
        </h2>
        
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
              <p className="text-gray-700 mb-2">Sign in to comment on this event</p>
              <Link to="/login">
                <Button>Sign In</Button>
              </Link>
            </Card.Content>
          </Card>
        )}
        
        {event.comments && event.comments.length > 0 ? (
          <div className="space-y-4">
            {event.comments.map((comment: any) => (
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

export default EventDetailPage;