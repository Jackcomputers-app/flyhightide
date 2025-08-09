import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { insertContactSchema, type InsertContact } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { Mail, Phone, MessageSquare } from 'lucide-react';

export const ContactForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      return apiRequest('POST', '/api/contacts', data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      console.error('Contact form error:', error);
    },
  });

  const onSubmit = (data: InsertContact) => {
    contactMutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Contact Us</CardTitle>
          <CardDescription className="text-gray-600">
            Have questions about our tours? We'd love to hear from you!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input placeholder="your@email.com" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input placeholder="(555) 123-4567" className="pl-10" {...field} value={field.value || ''} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="booking">Booking Question</SelectItem>
                          <SelectItem value="pricing">Pricing Information</SelectItem>
                          <SelectItem value="safety">Safety & Requirements</SelectItem>
                          <SelectItem value="weather">Weather Policy</SelectItem>
                          <SelectItem value="group">Group Bookings</SelectItem>
                          <SelectItem value="gift">Gift Certificates</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Textarea 
                          placeholder="Tell us how we can help you..."
                          className="pl-10 min-h-[120px]"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-ocean-blue hover:bg-blue-600 text-white"
                disabled={contactMutation.isPending}
              >
                {contactMutation.isPending ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </Form>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 text-coastal-teal mb-2" />
              <h3 className="font-semibold text-gray-900">Email</h3>
              <p className="text-sm text-gray-600">info@flyhightide.com</p>
            </div>
            <div className="flex flex-col items-center">
              <Phone className="h-8 w-8 text-coastal-teal mb-2" />
              <h3 className="font-semibold text-gray-900">Phone</h3>
              <p className="text-sm text-gray-600">(910) 555-0123</p>
            </div>
            <div className="flex flex-col items-center">
              <MessageSquare className="h-8 w-8 text-coastal-teal mb-2" />
              <h3 className="font-semibold text-gray-900">Response Time</h3>
              <p className="text-sm text-gray-600">Within 24 hours</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};