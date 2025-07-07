export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
  source: 'google' | 'tripadvisor';
  date: string;
  avatar?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 'lisa-howen',
    name: 'Lisa Howen',
    rating: 5,
    text: 'Fantastic time, friendly staff. Our pilot was very knowledgeable about the area. Would come here again and book one of their longer tours.',
    source: 'google',
    date: '3 months ago'
  },
  {
    id: 'russ-mooney',
    name: 'Russ Mooney',
    rating: 5,
    text: 'First time helo ride. Had a great flight and got to see the beautiful Carolina coast from the air. The pilots were awesome!',
    source: 'google',
    date: '8 months ago'
  },
  {
    id: 'nicole-c',
    name: 'Nicole C',
    rating: 5,
    text: 'This was our family\'s first time in a helicopter and first time in an aircraft for our daughter. We had the best experience. Paige was so sweet and knowledgeable about the area.',
    source: 'tripadvisor',
    date: 'May 4, 2024'
  },
  {
    id: 'jeremy-hudson',
    name: 'Jeremy Hudson',
    rating: 5,
    text: 'Crew came down to our local river festival and offered scenic tours around town. Our pilot Paige was awesome and can\'t thank her enough for such a wonderful flight for me and my son!',
    source: 'google',
    date: '8 months ago'
  },
  {
    id: 'jeffrey-brown',
    name: 'Jeffrey Brown',
    rating: 5,
    text: 'Had a great morning flight yesterday morning with Pilot Conner on an Oak Island tour. He was very thorough on the pre-flight instructions, and got in the air very promptly.',
    source: 'google',
    date: '9 months ago'
  },
  {
    id: 'sue-f',
    name: 'Sue F',
    rating: 5,
    text: 'Took the Beach Lover plane tour with my Granddaughter and what an amazing experience!! Hats off to our wonderful pilot Maddie! She is completely amazing and very knowledgeable!',
    source: 'tripadvisor',
    date: '6 days ago'
  },
  {
    id: 'ashley-007',
    name: '007ashley',
    rating: 5,
    text: 'Every time we have family and friends come to visit we take them on a ride. This is an excellent way to see the area. It is always fun to see the reaction to how many sharks are just off the coast.',
    source: 'tripadvisor',
    date: 'October 1, 2024'
  },
  {
    id: 'kristin-h',
    name: 'kristin h',
    rating: 5,
    text: 'What a delightful experience seeing the Oak Island and Bald Head area from the sky. Our pilot was a wonderful guide. The ride was smooth with a soft landing.',
    source: 'tripadvisor',
    date: 'March 14, 2024'
  }
];

export const getRandomTestimonials = (count: number = 3): Testimonial[] => {
  const shuffled = [...testimonials].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
