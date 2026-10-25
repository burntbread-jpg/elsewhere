import { getCollection } from 'astro:content';
export const publicTrips = async () => (await getCollection('trips', ({data}) => data.status === 'published' && data.visibility === 'public')).sort((a,b)=>b.data.tripStart.getTime()-a.data.tripStart.getTime());
export const dateLabel = (date: Date) => date.toLocaleDateString('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit'});
