import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Book, Megaphone, ArrowRight } from 'lucide-react';
import { announcementsAPI, eventsAPI, resourcesAPI } from '../lib/api';
import { formatRelativeTime, truncateText } from '../lib/utils';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Avatar from '../components/common/Avatar';

const HomePage = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [announcementsRes, eventsRes, resourcesRes] = await Promise.all([
          announcementsAPI.getAll(),
          eventsAPI.getAll(),
          resourcesAPI.getAll()
        ]);
        
        setAnnouncements(announcementsRes.data.slice(0, 3));
        setEvents(eventsRes.data.slice(0, 3));
        setResources(resourcesRes.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader size="lg" />
      </div>
    );
  }
  
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg overflow-hidden">
        <div className="py-12 px-6 sm:px-12 md:py-16 md:px-16 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Welcome to Campus Connect Portal
          </h1>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl">
            Your one-stop platform for campus announcements, events, and resources. Stay connected with what's happening on campus.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/announcements">
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                View Announcements
              </Button>
            </Link>
            <Link to="/events">
              <Button variant="outline" className="border-white text-white hover:bg-blue-700">
                Explore Events
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Latest Announcements */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Megaphone className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Latest Announcements</h2>
          </div>
          <Link to="/announcements" className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        {announcements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.map(announcement => (
              <Card key={announcement._id} className="h-full flex flex-col transition-transform hover:transform hover:scale-105">
                <Card.Header className="flex items-start space-x-3">
                  <Avatar name={announcement.createdBy?.name || 'User'} size="sm" />
                  <div>
                    <Card.Title>{truncateText(announcement.title, 40)}</Card.Title>
                    <p className="text-xs text-gray-500">
                      Posted by {announcement.createdBy?.name} • {formatRelativeTime(announcement.createdAt)}
                    </p>
                  </div>
                </Card.Header>
                <Card.Content className="flex-grow">
                  <p className="text-gray-700">
                    {truncateText(announcement.description, 100)}
                  </p>
                </Card.Content>
                <Card.Footer className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    {announcement.comments.length} comments
                  </div>
                  <Link to={`/announcements/${announcement._id}`}>
                    <Button variant="ghost" size="sm">
                      Read More
                    </Button>
                  </Link>
                </Card.Footer>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No announcements available.</p>
          </div>
        )}
      </section>
      
      {/* Upcoming Events */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
          </div>
          <Link to="/events" className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <Card key={event._id} className="h-full flex flex-col transition-all hover:shadow-lg">
                <Card.Header className="bg-blue-50">
                  <div className="flex justify-between items-start">
                    <Card.Title>{truncateText(event.title, 40)}</Card.Title>
                    <div className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <Card.Description>
                    Organized by {event.createdBy?.name}
                  </Card.Description>
                </Card.Header>
                <Card.Content className="flex-grow">
                  <p className="text-gray-700 mb-3">
                    {truncateText(event.description, 80)}
                  </p>
                  <div className="text-sm text-gray-600">
                    <div className="mb-1">
                      <span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div>
                      <span className="font-medium">Location:</span> {event.location}
                    </div>
                  </div>
                </Card.Content>
                <Card.Footer className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    {event.registeredUsers?.length || 0} registered
                  </div>
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
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No upcoming events.</p>
          </div>
        )}
      </section>
      
      {/* Recent Resources */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Book className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Recent Resources</h2>
          </div>
          <Link to="/resources" className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        {resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map(resource => (
              <Card key={resource._id} className="h-full flex flex-col border border-gray-200 hover:border-blue-300">
                <Card.Header>
                  <Card.Title>{truncateText(resource.title, 40)}</Card.Title>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {resource.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(resource.createdAt)}
                    </span>
                  </div>
                </Card.Header>
                <Card.Content className="flex-grow">
                  <p className="text-gray-700">
                    {truncateText(resource.description, 80)}
                  </p>
                </Card.Content>
                <Card.Footer className="flex justify-between items-center">
                  <div className="text-xs text-gray-500 flex items-center">
                    <Avatar name={resource.uploadedBy?.name || 'User'} size="xs" />
                    <span className="ml-2">{resource.uploadedBy?.name}</span>
                  </div>
                  <Link to={`/resources/${resource._id}`}>
                    <Button variant="outline" size="sm">
                      View Resource
                    </Button>
                  </Link>
                </Card.Footer>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No resources available.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;