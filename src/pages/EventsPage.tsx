import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Search, Calendar } from 'lucide-react';
import { eventsAPI } from '../lib/api';
import { formatDate, formatRelativeTime } from '../lib/utils';
import { isFaculty } from '../lib/auth';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loader from '../components/common/Loader';

type FilterForm = {
  searchTerm: string;
  dateFilter: string;
};

const EventsPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const userIsFaculty = isFaculty();
  
  const { register, watch } = useForm<FilterForm>({
    defaultValues: {
      searchTerm: '',
      dateFilter: 'all'
    }
  });
  
  const searchTerm = watch('searchTerm');
  const dateFilter = watch('dateFilter');
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventsAPI.getAll();
        // Sort events by date (upcoming first)
        const sortedEvents = response.data.sort((a: any, b: any) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setEvents(sortedEvents);
        setFilteredEvents(sortedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  useEffect(() => {
    let filtered = [...events];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        event => 
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply date filter
    const now = new Date();
    if (dateFilter === 'upcoming') {
      filtered = filtered.filter(event => new Date(event.date) >= now);
    } else if (dateFilter === 'past') {
      filtered = filtered.filter(event => new Date(event.date) < now);
    }
    
    setFilteredEvents(filtered);
  }, [searchTerm, dateFilter, events]);
  
  const isEventPast = (date: string) => {
    return new Date(date) < new Date();
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader size="lg" />
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
          Events &amp; Seminars
        </h1>
        {userIsFaculty && (
          <Link to="/events/new">
            <Button className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </Link>
        )}
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search events..."
              className="pl-10"
              {...register('searchTerm')}
            />
          </div>
          <div className="flex-shrink-0 w-full sm:w-auto">
            <select
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('dateFilter')}
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming Events</option>
              <option value="past">Past Events</option>
            </select>
          </div>
        </div>
      </div>
      
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <Card key={event._id} className={`h-full flex flex-col transition-all hover:shadow-lg ${
              isEventPast(event.date) ? 'opacity-75' : ''
            }`}>
              <Card.Header className="bg-blue-50">
                <div className="flex justify-between items-start">
                  <Card.Title className="text-xl">
                    {event.title}
                  </Card.Title>
                  <div className={`text-xs font-semibold px-2 py-1 rounded ${
                    isEventPast(event.date)
                      ? 'bg-gray-600 text-white'
                      : 'bg-blue-600 text-white'
                  }`}>
                    {isEventPast(event.date) ? 'Past' : 'Upcoming'}
                  </div>
                </div>
                <Card.Description>
                  Organized by {event.createdBy?.name}
                </Card.Description>
              </Card.Header>
              <Card.Content className="flex-grow">
                <div className="flex items-center text-gray-700 mb-3">
                  <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <p className="text-gray-700 mb-3">
                  {event.description.length > 100
                    ? `${event.description.substring(0, 100)}...`
                    : event.description}
                </p>
                <div className="text-sm text-gray-600">
                  <p><span className="font-medium">Location:</span> {event.location}</p>
                  {event.registrationLimit > 0 && (
                    <p>
                      <span className="font-medium">Capacity:</span> {event.registeredUsers?.length || 0} / {event.registrationLimit}
                    </p>
                  )}
                </div>
              </Card.Content>
              <Card.Footer className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Created {formatRelativeTime(event.createdAt)}
                </span>
                <Link to={`/events/${event._id}`}>
                  <Button variant="primary" size="sm">
                    View Details
                  </Button>
                </Link>
              </Card.Footer>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-500 mb-4">No events found</p>
          {searchTerm && (
            <Button variant="outline" onClick={() => register('searchTerm').onChange({ target: { value: '' } })}>
              Clear Search
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventsPage;