import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { resourcesAPI } from '../lib/api';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import TextArea from '../components/common/TextArea';
import Button from '../components/common/Button';

type FormData = {
  title: string;
  description: string;
  fileUrl: string;
  category: string;
};

const CreateResourcePage = () => {
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
  
      // Auto-prepend 'https://' if missing
      if (!/^https?:\/\//i.test(data.fileUrl)) {
        data.fileUrl = 'https://' + data.fileUrl;
      }
  
      await resourcesAPI.create(data);
      toast.success('Resource created successfully!');
      navigate('/resources');
    } catch (error) {
      console.error('Error creating resource:', error);
      toast.error('Failed to create resource');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload New Resource</h1>
      
      <Card className="max-w-2xl">
        <Card.Content>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              id="title"
              label="Title"
              placeholder="Enter resource title"
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
              placeholder="Enter resource description"
              error={errors.description?.message}
              disabled={isSubmitting}
              required
              rows={4}
              {...register('description', {
                required: 'Description is required',
                minLength: {
                  value: 10,
                  message: 'Description must be at least 10 characters'
                }
              })}
            />
            
            <Input
              id="fileUrl"
              label="Resource URL"
              placeholder="Enter the URL of your resource"
              error={errors.fileUrl?.message}
              disabled={isSubmitting}
              required
              {...register('fileUrl', {
                required: 'Resource URL is required',
                pattern: {
                    value: /^(https?:\/\/)[^\s/$.?#].[^\s]*$/,
                    message: 'Please enter a valid URL starting with http:// or https://'
                  }                  
              })}
            />
            
            <Input
              id="category"
              label="Category"
              placeholder="Enter resource category"
              error={errors.category?.message}
              disabled={isSubmitting}
              required
              {...register('category', {
                required: 'Category is required'
              })}
            />
            
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/resources')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
              >
                Upload Resource
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
};

export default CreateResourcePage;