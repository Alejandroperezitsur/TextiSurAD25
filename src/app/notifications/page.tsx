"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useNotifications, type NotificationItem } from "@/context/NotificationsContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bell, CheckCircle, Clock } from "lucide-react";

function formatDate(ts: number) {
  try {
    const d = new Date(ts);
    return d.toLocaleString();
  } catch {
    return String(ts);
  }
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const {
    getUserNotifications,
    markUserNotificationRead,
    unreadCountForCurrentUser,
  } = useNotifications();

  const notifications: NotificationItem[] = useMemo(() => {
    if (!user?.email) return [];
    const list = getUserNotifications(user.email);
    // newest first
    return [...list].sort((a, b) => b.createdAt - a.createdAt);
  }, [user?.email, getUserNotifications]);

  if (!user) {
    return (
      <div className="container mx-auto max-w-3xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>Notificaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Debes iniciar sesión para ver tus notificaciones.</p>
            <div className="mt-4">
              <Link href="/login" className="inline-block">
                <Button>Iniciar sesión</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const unreadCount = unreadCountForCurrentUser ?? 0;

  const handleMarkAll = () => {
    if (!user?.email) return;
    notifications.forEach((n) => {
      if (!n.read) markUserNotificationRead(user.email, n.id);
    });
  };

  return (
    <div className="container mx-auto max-w-3xl py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h1 className="text-2xl font-semibold">Notificaciones</h1>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">{unreadCount} sin leer</Badge>
          )}
        </div>
        <Button variant="outline" onClick={handleMarkAll} disabled={unreadCount === 0}>
          Marcar todas como leídas
        </Button>
      </div>
      <Separator />

      {notifications.length === 0 ? (
        <div className="text-center text-muted-foreground mt-10">
          No tienes notificaciones aún.
        </div>
      ) : (
        <div className="space-y-4 mt-6">
          {notifications.map((n) => (
            <Card key={n.id} className={n.read ? "opacity-75" : ""}>
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {n.read ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-600" />
                    )}
                    <CardTitle className="text-base">{n.title}</CardTitle>
                    {n.type && <Badge variant="outline" className="ml-2 capitalize">{n.type}</Badge>}
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(n.createdAt)}</span>
                </div>
              </CardHeader>
              <CardContent className="py-3">
                <p className="text-sm mb-3">{n.message}</p>
                <div className="flex items-center gap-3">
                  {!n.read && user?.email && (
                    <Button size="sm" onClick={() => markUserNotificationRead(user.email!, n.id)}>
                      Marcar leída
                    </Button>
                  )}
                  {n.link && (
                    <Link href={n.link} className="text-sm">
                      <Button size="sm" variant="outline">Ver detalle</Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}