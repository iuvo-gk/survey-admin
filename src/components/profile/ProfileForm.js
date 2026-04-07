import React, { useEffect, useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { InputField } from "../ui/FormField";

function ProfileForm(props) {
  var [formState, setFormState] = useState({
    first_name: props.user.first_name || "",
    last_name: props.user.last_name || "",
    email: props.user.email || "",
    old_password: "",
    new_password: "",
  });

  useEffect(
    function syncUser() {
      setFormState(function setNextState(previousState) {
        return Object.assign({}, previousState, {
          first_name: props.user.first_name || "",
          last_name: props.user.last_name || "",
          email: props.user.email || "",
        });
      });
    },
    [props.user.email, props.user.first_name, props.user.last_name]
  );

  function updateField(key, value) {
    setFormState(function setNextState(previousState) {
      return Object.assign({}, previousState, { [key]: value });
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    var payload = {
      first_name: formState.first_name,
      last_name: formState.last_name,
      email: formState.email,
    };

    if (formState.old_password.trim() && formState.new_password.trim()) {
      payload.password = {
        old_password: formState.old_password,
        new_password: formState.new_password,
      };
    }

    props.onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-12">
      <div className="space-y-6 xl:col-span-7">
        <Card className="p-8">
          <div className="mb-6">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
              Identity
            </div>
            <h2 className="mt-3 font-headline text-3xl font-black tracking-tight text-on-surface">
              Update account details
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="First name"
              value={formState.first_name}
              onChange={function onChange(event) {
                updateField("first_name", event.target.value);
              }}
            />
            <InputField
              label="Last name"
              value={formState.last_name}
              onChange={function onChange(event) {
                updateField("last_name", event.target.value);
              }}
            />
            <InputField
              className="md:col-span-2"
              label="Email"
              type="email"
              value={formState.email}
              onChange={function onChange(event) {
                updateField("email", event.target.value);
              }}
            />
          </div>
        </Card>

        <Card className="p-8">
          <div className="mb-6">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
              Security
            </div>
            <h2 className="mt-3 font-headline text-3xl font-black tracking-tight text-on-surface">
              Change password
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Current password"
              type="password"
              value={formState.old_password}
              onChange={function onChange(event) {
                updateField("old_password", event.target.value);
              }}
            />
            <InputField
              label="New password"
              type="password"
              value={formState.new_password}
              onChange={function onChange(event) {
                updateField("new_password", event.target.value);
              }}
            />
          </div>
        </Card>
      </div>

      <div className="space-y-6 xl:col-span-5">
        <Card className="p-8">
          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
            Session
          </div>
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-500">
            <div>Created: {props.user.createdAt}</div>
            <div>Updated: {props.user.updatedAt}</div>
            <div>Email login: {props.user.email}</div>
          </div>
          <div className="mt-6">
            <Button type="submit" fullWidth iconLeft={props.saving ? "hourglass_top" : "save"} disabled={props.saving}>
              {props.saving ? "Saving profile..." : "Save changes"}
            </Button>
          </div>
        </Card>
      </div>
    </form>
  );
}

export default ProfileForm;
