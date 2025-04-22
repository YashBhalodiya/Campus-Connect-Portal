import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { announcementsAPI } from '../lib/api';
import { formatRelativeTime } from '../lib/utils';
import { isFaculty } from '../lib/auth';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loader from '../components/common/Loader';
import Avatar from '../components/common/Avatar';

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const userIsFaculty = isFaculty();
  
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await announcementsAPI.getAll();
        setAnnouncements(response.data);
        setFilteredAnnouncements(response.data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnnouncements();
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAnnouncements(announcements);
    } else {
      const filtered = announcements.filter(
        announcement => 
          announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          announcement.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAnnouncements(filtered);
    }
  }, [searchTerm, announcements]);
  
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
          Announcements
        </h1>
        {userIsFaculty && (
          <Link to="/announcements/new">
            <Button className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              New Announcement
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
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div>
            <Button variant="outline" className="w-full sm:w-auto flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
      </div>
      
      {filteredAnnouncements.length > 0 ? (
        <div className="space-y-6">
          {filteredAnnouncements.map(announcement => (
            <Card key={announcement._id} className="transition-all hover:shadow-md">
              <Card.Header className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-2 sm:mb-0">
                  <Link to={`/announcements/${announcement._id}`} className="hover:text-blue-600">
                    <Card.Title className="text-xl">{announcement.title}</Card.Title>
                  </Link>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <Avatar name={announcement.createdBy?.name || 'User'} size="xs" />
                    <span className="ml-2">{announcement.createdBy?.name}</span>
                    <span className="mx-2">•</span>
                    <span>{formatRelativeTime(announcement.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {announcement.comments.length} comments
                  </span>
                  <span className="text-sm text-gray-500">
                    {announcement.likes?.length || 0} likes
                  </span>
                </div>
              </Card.Header>
              <Card.Content>
                <p className="text-gray-700">
                  {announcement.description.length > 250
                    ? `${announcement.description.substring(0, 250)}...`
                    : announcement.description}
                </p>
              </Card.Content>
              <Card.Footer className="flex justify-end">
                <Link to={`/announcements/${announcement._id}`}>
                  <Button variant="ghost">Read More</Button>
                </Link>
              </Card.Footer>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-500 mb-4">No announcements found</p>
          {searchTerm && (
            <Button variant="outline" onClick={() => setSearchTerm('')}>
              Clear Search
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AnnouncementsPage;