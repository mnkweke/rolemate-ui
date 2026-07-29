"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Shield, Loader2, Plus, UserX, UserCog,
  Mail, Calendar, Clock, CheckCircle2, XCircle,
} from "lucide-react";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import api from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { timeAgo } from "@/lib/timeAgo";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login: string | null;
}

export default function AdminAdminsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", page, search, roleFilter],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, page_size: 20 };
      if (search) params.search = search;
      if (roleFilter) params.role_filter = roleFilter;
      const { data } = await api.get("/admin/users", { params });
      return data;
    },
  });

  const createUser = useMutation({
    mutationFn: async (form: { email: string; password: string; name: string; role: string }) => {
      const { data } = await api.post("/admin/users", form);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setCreateOpen(false);
      toast({ title: "User created", variant: "success" });
    },
    onError: (err: any) => {
      toast({ title: "Failed to create user", description: err?.response?.data?.detail || err.message, variant: "destructive" });
    },
  });

  const updateUser = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { data } = await api.put(`/admin/users/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setEditUser(null);
      toast({ title: "User updated", variant: "success" });
    },
    onError: (err: any) => {
      toast({ title: "Failed to update user", description: err?.response?.data?.detail || err.message, variant: "destructive" });
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/admin/users/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast({ title: "Admin removed", variant: "success" });
    },
    onError: (err: any) => {
      toast({ title: "Failed to remove admin", description: err?.response?.data?.detail || err.message, variant: "destructive" });
    },
  });

  const users: AdminUser[] = data?.users ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Administrators</h3>
          <p className="text-sm text-muted-foreground">Manage admin users ({total} total)</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Create Admin</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Administrator</DialogTitle></DialogHeader>
            <CreateAdminForm onSubmit={(data) => createUser.mutate(data)} isLoading={createUser.isPending} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="max-w-xs"
        />
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
        >
          <option value="">All roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => (<Skeleton key={i} className="h-16 w-full" />))}</div>
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <Card key={u.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className={`h-3 w-3 rounded-full ${u.is_active ? "bg-green-500" : "bg-red-500"}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{u.name || u.email}</span>
                      <Badge variant={u.role === "super_admin" ? "default" : "secondary"} className="text-xs">
                        {u.role === "super_admin" ? "Super Admin" : u.role === "admin" ? "Admin" : "User"}
                      </Badge>
                      {!u.is_active && <Badge variant="destructive" className="text-xs">Disabled</Badge>}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{u.email}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{u.created_at ? timeAgo(u.created_at) : "N/A"}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Last login: {u.last_login ? timeAgo(u.last_login) : "Never"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditUser(u)}>
                    <UserCog className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost" size="sm"
                    onClick={() => deleteUser.mutate(u.id)}
                    disabled={deleteUser.isPending}
                    className="text-red-400 hover:text-red-300"
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {users.length === 0 && <p className="text-sm text-muted-foreground py-8 text-center">No users found</p>}
        </div>
      )}

      {total > 20 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
          <span className="flex items-center text-sm text-muted-foreground">Page {page} of {Math.ceil(total / 20)}</span>
          <Button variant="outline" size="sm" disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      )}

      <Dialog open={!!editUser} onOpenChange={(o) => { if (!o) setEditUser(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Administrator</DialogTitle></DialogHeader>
          {editUser && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} />
              </div>
              <div>
                <Label>Role</Label>
                <select
                  value={editUser.role}
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div>
                <Label>Status</Label>
                <select
                  value={editUser.is_active ? "active" : "disabled"}
                  onChange={(e) => setEditUser({ ...editUser, is_active: e.target.value === "active" })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
              <Button
                className="w-full"
                onClick={() => updateUser.mutate({ id: editUser.id, role: editUser.role, is_active: editUser.is_active, name: editUser.name })}
                disabled={updateUser.isPending}
              >
                {updateUser.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreateAdminForm({ onSubmit, isLoading }: { onSubmit: (data: any) => void; isLoading: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");

  return (
    <div className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Admin name" />
      </div>
      <div>
        <Label>Email</Label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" type="email" />
      </div>
      <div>
        <Label>Temporary Password</Label>
        <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Min 8 characters" />
      </div>
      <div>
        <Label>Role</Label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
      </div>
      <Button
        className="w-full"
        onClick={() => onSubmit({ name, email, password, role })}
        disabled={isLoading || !name || !email || !password}
      >
        {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
        Create Administrator
      </Button>
    </div>
  );
}
