import { getCollection, type CollectionEntry } from 'astro:content';
type Trip = CollectionEntry<'trips'>;
// Newest first; journeys that share a start date fall back to their volume number.
const byNewest = (a: Trip, b: Trip) => b.data.tripStart.getTime()-a.data.tripStart.getTime() || (b.data.volume??0)-(a.data.volume??0);
// Layout samples stand in only until the first real journey is published.
export const publicTrips = async () => {
 const visible = await getCollection('trips', ({data}) => data.status === 'published' && data.visibility === 'public');
 const real = visible.filter(t => !t.data.sample);
 return (real.length ? real : visible).sort(byNewest);
};
export const dateLabel = (date: Date) => date.toLocaleDateString('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit'});
const monthLabel = (date: Date) => `${date.getFullYear()}. ${String(date.getMonth()+1).padStart(2,'0')}.`;
export const tripDateLabel = (trip: Trip, which: 'start'|'end' = 'start') => {
 const date = which === 'start' ? trip.data.tripStart : trip.data.tripEnd;
 return trip.data.datePrecision === 'month' ? monthLabel(date) : dateLabel(date);
};
export const tripRangeLabel = (trip: Trip) => {
 const start = tripDateLabel(trip,'start'), end = tripDateLabel(trip,'end');
 return start === end ? start : `${start} — ${end}`;
};
export const CONTINENTS = ['ASIA','EUROPE','AFRICA','NORTH AMERICA','SOUTH AMERICA','OCEANIA'] as const;
export const continentSlug = (continent: string) => continent.toLowerCase().replace(/\s+/g,'-');
