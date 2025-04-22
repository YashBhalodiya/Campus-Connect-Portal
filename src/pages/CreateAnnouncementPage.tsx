import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { announcementsAPI } from '../lib/api';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import TextArea from '../components/common/TextArea';
import Button from '../components/common/Button';

type FormData = {
  title: string;
  description: string;
};

const CreateAnnouncementPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>();
  
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await announcementsAPI.create(data);
      toast.success('Announcement created successfully!');
      navigate('/announcements');
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error('Failed to create announcement');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Announcement</h1>
      
      <Card className="max-w-2xl">
        <Card.Content>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              id="title"
              label="Title"
              placeholder="Enter announcement title"
              error={errors.title?.message}
              disabled={isSubmitting}
              required
              {...register('title', {
                required: 'Title is required',
                minLength: {
                  value: 3,
                  message: 'Title must be at least 3 characters'
                }
              })}
            />
            
            <TextArea
              id="description"
              label="Description"
              placeholder="Enter announcement details"
              error={errors.description?.message}
              disabled={isSubmitting}
              required
              rows={6}
              {...register('description', {
                required: 'Description is required',
                minLength: {
                  value: 10,
                  message: 'Description must be at least 10 characters'
                }
              })}
            />
            
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/announcements')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
              >
                Create Announcement
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
};

export default CreateAnnouncementPage;