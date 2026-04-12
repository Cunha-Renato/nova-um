"use client"

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";

function Badge({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-xs font-medium">
      {label}
      <button type="button" onClick={onRemove} className="hover:text-red-500 transition-colors">
        ✕
      </button>
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
      {children}
    </h2>
  );
}

function CustomerCard({
  customer,
  tags,
  eventDates,
}: {
  customer: any;
  tags: any[];
  eventDates: any[];
}) {
  const customerTags =
    useQuery(api.tables.customer.listAllTagsCustomer, {
      customer_id: customer._id,
    }) ?? [];
  const customerEventDates =
    useQuery(api.tables.customer.listAllEventDatesCustomer, {
      customer_id: customer._id,
    }) ?? [];

  const removeCustomer = useMutation(api.tables.customer.removeCustomer);
  const addTag = useMutation(api.tables.customer.addTagCustomer);
  const removeTag = useMutation(api.tables.customer.removeTagCustomer);
  const addEvent = useMutation(api.tables.customer.addEventDateCustomer);
  const removeEvent = useMutation(api.tables.customer.removeEventDateCustomer);

  const assignedTagIds = new Set(customerTags.map((ct: any) => ct.tag_id));
  const assignedEventIds = new Set(customerEventDates.map((ce: any) => ce.event_date_id));
  const unassignedTags = tags.filter((t) => !assignedTagIds.has(t._id));
  const unassignedEvents = eventDates.filter((e) => !assignedEventIds.has(e._id));

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col gap-4">
      {/* header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-zinc-900 text-sm">{customer.name}</p>
          {customer.phone_number !== 0 && (
            <p className="text-xs text-zinc-400">{customer.phone_number}</p>
          )}
          {customer.observations && (
            <p className="text-xs text-zinc-500 mt-1">{customer.observations}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => removeCustomer({ customer_id: customer._id })}
          className="text-zinc-300 hover:text-red-400 transition-colors text-sm leading-none"
        >
          ✕
        </button>
      </div>

      {/* tags */}
      <div>
        <p className="text-xs text-zinc-400 mb-1.5">Tags</p>
        <div className="flex flex-wrap gap-1.5">
          {customerTags.map((ct: any) => {
            const tag = tags.find((t) => t._id === ct.tag_id);
            return tag ? (
              <Badge
                key={ct._id}
                label={tag.name}
                onRemove={() =>
                  removeTag({ tag_id: tag._id, customer_id: customer._id })
                }
              />
            ) : null;
          })}
          {unassignedTags.length > 0 && (
            <select
              className="text-xs border border-zinc-200 rounded-full px-2 py-0.5 text-zinc-500 focus:outline-none"
              defaultValue=""
              onChange={(e) => {
                if (!e.target.value) return;
                addTag({ tag_id: e.target.value as Id<"tags">, customer_id: customer._id });
                e.target.value = "";
              }}
            >
              <option value="" disabled>+ tag</option>
              {unassignedTags.map((t) => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* event dates */}
      <div>
        <p className="text-xs text-zinc-400 mb-1.5">Event dates</p>
        <div className="flex flex-wrap gap-1.5">
          {customerEventDates.map((ce: any) => {
            const ev = eventDates.find((e) => e._id === ce.event_date_id);
            return ev ? (
              <Badge
                key={ce._id}
                label={`${ev.name} · ${new Date(ev.date).toLocaleDateString()}`}
                onRemove={() =>
                  removeEvent({ event_date_id: ev._id, customer_id: customer._id })
                }
              />
            ) : null;
          })}
          {unassignedEvents.length > 0 && (
            <select
              className="text-xs border border-zinc-200 rounded-full px-2 py-0.5 text-zinc-500 focus:outline-none"
              defaultValue=""
              onChange={(e) => {
                if (!e.target.value) return;
                addEvent({ event_date_id: e.target.value as Id<"event_dates">, customer_id: customer._id });
                e.target.value = "";
              }}
            >
              <option value="" disabled>+ event</option>
              {unassignedEvents.map((ev) => (
                <option key={ev._id} value={ev._id}>{ev.name}</option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
}

function AddCustomerForm({ onAdd }: { onAdd: (data: any) => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [observations, setObservations] = useState("");

  function handleAdd() {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), phone_number: Number(phone) || 0, observations: observations.trim() || undefined });
    setName("");
    setPhone("");
    setObservations("");
  }

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex gap-2">
        <input
          className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <input
          className="w-36 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
          placeholder="Observations (optional)"
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 text-sm bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function AddRow({
  placeholder,
  onAdd,
  extra,
}: {
  placeholder: string;
  onAdd: (name: string, extra?: string) => void;
  extra?: { placeholder: string; type?: string };
}) {
  const [name, setName] = useState("");
  const [extraVal, setExtraVal] = useState("");

  function handleAdd() {
    if (!name.trim()) return;
    onAdd(name.trim(), extraVal || undefined);
    setName("");
    setExtraVal("");
  }

  return (
    <div className="flex gap-2 mb-4">
      <input
        className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
        placeholder={placeholder}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
      />
      {extra && (
        <input
          className="w-36 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
          placeholder={extra.placeholder}
          type={extra.type ?? "text"}
          value={extraVal}
          onChange={(e) => setExtraVal(e.target.value)}
        />
      )}
      <button
        type="button"
        onClick={handleAdd}
        className="px-4 py-2 text-sm bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 transition-colors"
      >
        Add
      </button>
    </div>
  );
}

export default function DashboardPage() {
  const customers = useQuery(api.tables.customer.listCustomers) ?? [];
  const tags = useQuery(api.tables.tags.listTags) ?? [];
  const eventDates = useQuery(api.tables.event_dates.listEventDate) ?? [];

  const addCustomer = useMutation(api.tables.customer.addCustomer);
  const addTag = useMutation(api.tables.tags.addTag);
  const removeTag = useMutation(api.tables.tags.removeTag);
  const addEventDate = useMutation(api.tables.event_dates.addEventDate);
  const removeEventDate = useMutation(api.tables.event_dates.removeEventDate);

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>

        {/* tags + event dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-5">
            <SectionTitle>Tags</SectionTitle>
            <AddRow
              placeholder="Tag name"
              onAdd={(name) => addTag({ name })}
            />
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag._id}
                  label={tag.name}
                  onRemove={() => removeTag({ tag_id: tag._id })}
                />
              ))}
              {tags.length === 0 && (
                <p className="text-xs text-zinc-400">No tags yet.</p>
              )}
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-5">
            <SectionTitle>Event dates</SectionTitle>
            <AddRow
              placeholder="Event name"
              extra={{ placeholder: "Date", type: "date" }}
              onAdd={(name, date) => {
                if (!date) return;
                addEventDate({ name, date: new Date(date).getTime() });
              }}
            />
            <div className="flex flex-col gap-2">
              {eventDates.map((ev) => (
                <div key={ev._id} className="flex items-center justify-between text-sm">
                  <span className="text-zinc-700">{ev.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400">
                      {new Date(ev.date).toLocaleDateString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeEventDate({ event_id: ev._id })}
                      className="text-zinc-300 hover:text-red-400 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              {eventDates.length === 0 && (
                <p className="text-xs text-zinc-400">No event dates yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* customers */}
        <div>
          <SectionTitle>Customers</SectionTitle>
          <AddCustomerForm
            onAdd={({ name, phone_number, observations }) =>
              addCustomer({ name, phone_number, observations })
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customers.map((customer) => (
              <CustomerCard
                key={customer._id}
                customer={customer}
                tags={tags}
                eventDates={eventDates}
              />
            ))}
            {customers.length === 0 && (
              <p className="text-xs text-zinc-400 col-span-full">
                No customers yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}