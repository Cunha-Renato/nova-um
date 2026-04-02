"use client"

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const tests = useQuery(api.test.mutation.listTests);
  const add_test = useMutation(api.test.mutation.createTest);

  return (
    <>
      {
        tests?.map((test) => (
          <p key={test._id}>{test.value}</p>
        ))
      }

      <button
        type="button"
        onClick={() => {
          add_test({ value: Math.random() })
        }}
      >
        Create Test
      </button>
    </>
  );
}
