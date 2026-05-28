import { useUser } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";


export function useStoreUser() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  // When this state is set we know the server
  // has stored the user.
  const [userId, setUserId] = useState(null);
  const [storeError, setStoreError] = useState(null);
  const storeUser = useMutation(api.users.store);
  // Call the `storeUser` mutation function to store
  // the current user in the `users` table and return the `Id` value.
  useEffect(() => {
    // If the user is not logged in don't do anything
    if (!isAuthenticated) {
      return;
    }
    // Store the user in the database.
    // Recall that `storeUser` gets the user information via the `auth`
    // object on the server. You don't need to pass anything manually here.
    let canceled = false;

    async function createUser() {
      try {
        const id = await storeUser();
        if (!canceled) {
          setUserId(id);
          setStoreError(null);
        }
      } catch (error) {
        if (!canceled) {
          setStoreError(error);
        }
      }
    }

    createUser();
    return () => {
      canceled = true;
      setUserId(null);
    };
    // Make sure the effect reruns if the user logs in with
    // a different identity
  }, [isAuthenticated, storeUser, user?.id]);
  // Combine the local state with the state from context
  return {
    isLoading:
      isLoading || (isAuthenticated && userId === null && storeError === null),
    isAuthenticated: isAuthenticated && userId !== null,
    error: storeError,
  };
}
