import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} from "@/features/calendar/api/calendarApi.js";

export const useEvents = (range) =>
  useQuery({
    queryKey: ["events", range],
    queryFn: () => getEvents(range),
    placeholderData: keepPreviousData,
  });

function useEventMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });
}

export const useCreateEvent = () => useEventMutation(createEvent);
export const useUpdateEvent = () => useEventMutation(updateEvent);
export const useDeleteEvent = () => useEventMutation(deleteEvent);
