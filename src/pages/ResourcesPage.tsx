import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Search, FileText, ExternalLink } from 'lucide-react';
import { resourcesAPI } from '../lib/api';
import { formatRelativeTime } from '../lib/utils';
import { isAuthenticated } from '../lib/auth';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loader from '../components/common/Loader';
import Avatar from '../components/common/Avatar';

type FilterForm = {
  searchTerm: string;
  category: string;
};

const ResourcesPage = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [filteredResources, setFilteredResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  
  const authenticated = isAuthenticated();
  
  const { register, watch } = useForm<FilterForm>({
    defaultValues: {
      searchTerm: '',
      category: 'all'
    }
  });
  
  const searchTerm = watch('searchTerm');
  const categoryFilter = watch('category');
  
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await resourcesAPI.getAll();
        setResources(response.data);
        setFilteredResources(response.data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(response.data.map((resource: any) => resource.category))] as string[];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching resources:', error);
        toast.error('Failed to load resources');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResources();
  }, []);
  
  useEffect(() => {
    let filtered = [...resources];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        resource => 
          resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter && categoryFilter !== 'all') {
      filtered = filtered.filter(resource => resource.category === categoryFilter);
    }
    
    setFilteredResources(filtered);
  }, [searchTerm, categoryFilter, resources]);
  
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
          Study Resources
        </h1>
        {authenticated && (
          <Link to="/resources/new">
            <Button className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Upload Resource
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
              placeholder="Search resources..."
              className="pl-10"
              {...register('searchTerm')}
            />
          </div>
          <div className="flex-shrink-0 w-full sm:w-auto">
            <select
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('category')}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => (
            <Card key={resource._id} className="h-full flex flex-col transition-all hover:shadow-lg">
              <Card.Header>
                <div className="flex justify-between items-start">
                  <Card.Title className="text-xl">{resource.title}</Card.Title>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {resource.category}
                  </span>
                </div>
                <div className="flex items-center mt-2">
                  <Avatar name={resource.uploadedBy?.name || 'User'} size="xs" />
                  <span className="ml-2 text-sm text-gray-500">
                    {resource.uploadedBy?.name} • {formatRelativeTime(resource.createdAt)}
                  </span>
                </div>
              </Card.Header>
              <Card.Content className="flex-grow">
                <p className="text-gray-700 mb-4">
                  {resource.description.length > 120
                    ? `${resource.description.substring(0, 120)}...`
                    : resource.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {resource.comments?.length || 0} comments
                  </div>
                  <div className="text-sm text-gray-500">
                    {resource.likes?.length || 0} likes
                  </div>
                </div>
              </Card.Content>
              <Card.Footer className="flex justify-between items-center">
                <Link to={`/resources/${resource._id}`}>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <FileText className="mr-1 h-4 w-4" />
                    View Details
                  </Button>
                </Link>
                <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <ExternalLink className="mr-1 h-4 w-4" />
                    Open
                  </Button>
                </a>
              </Card.Footer>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-500 mb-4">No resources found</p>
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

export default ResourcesPage;