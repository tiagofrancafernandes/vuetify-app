import { AxiosInstance } from 'axios';
import { Manager, Socket } from 'socket.io-client';
import { ComputedRef, InjectionKey, Ref } from 'vue';
import { RouteLocationNamedRaw } from 'vue-router';

import { IRoomMemberResponse, IRoomResponse } from './interfaces/rooms';

export namespace KEYS {
  export const AXIOS: InjectionKey<AxiosInstance> = Symbol('axios');

  export const MANAGER_SOCKETS: InjectionKey<Manager> =
    Symbol('manager:sockets');

  export const SOCKET_CHAT: InjectionKey<Ref<Socket>> = Symbol('socket:chat');

  export const SOCKET_DASHBOARD: InjectionKey<Ref<Socket>> =
    Symbol('socket:dashboard');

  export const SOCKET_NOTIFICATIONS: InjectionKey<Ref<Socket>> = Symbol(
    'socket:notifications',
  );

  export namespace THEMES {
    export const IS_DARK: InjectionKey<ComputedRef<boolean>> =
      Symbol('theme:isDark');
  }

  export namespace DRAWER {
    export const SHOW: InjectionKey<Ref<boolean | null>> =
      Symbol('drawer:show');
    export const IS_ACTIVE: InjectionKey<
      (item: RouteLocationNamedRaw, prefix?: boolean) => boolean
    > = Symbol('drawer:isActive');
    export const ROOMS: InjectionKey<Readonly<Ref<Array<IRoomResponse>>>> =
      Symbol('drawer:rooms');
    export const UPDATE_ROOMS: InjectionKey<
      (data: Array<IRoomResponse>) => void
    > = Symbol('drawer:updateRooms');
  }
  export namespace SNACKBAR {
    export const QUEUE: InjectionKey<Array<object>> = Symbol('snackbar:queue');
    export const CURRENT: InjectionKey<Ref<object>> =
      Symbol('snackbar:current');
    export const SHOW: InjectionKey<Ref<boolean>> = Symbol('snackbar:show');
  }

  export namespace CHAT {
    export const ROOM: InjectionKey<Ref<IRoomResponse>> = Symbol('chat:room');
    export const CURRENT_MEMBER: InjectionKey<
      Readonly<Ref<IRoomMemberResponse | undefined>>
    > = Symbol('chat:currentMember');
    export const TARGET_MEMBER: InjectionKey<
      Readonly<Ref<IRoomMemberResponse | undefined>>
    > = Symbol('chat:targetMember');
  }
}

export namespace MESSAGE_FILE {
  // 25 MiB
  export const MAX_FILE_SIZE = 26_214_400;

  // MEDIA MIME TYPES
  export const IMAGE_MIME_TYPES =
    /image\/(jpe?g|png|gif|bmp|webp|svg\+xml|tiff)/;

  // OFFICE MIME TYPES
  export const MICROSOFT_MIME_TYPES =
    /(application\/((msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)|(vnd\.ms-excel|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)|(vnd\.ms-powerpoint|vnd\.openxmlformats-officedocument\.presentationml\.presentation)|onenote|vnd\.publisher|vnd\.visio|vnd\.ms-project|vnd\.ms-access))/;
  export const GOOGLE_MIME_TYPES =
    /(application\/(vnd\.google-apps\.document|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|msword)|application\/(vnd\.google-apps\.spreadsheet|vnd\.ms-excel|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)|application\/(vnd\.google-apps\.presentation|vnd\.ms-powerpoint|vnd\.openxmlformats-officedocument\.presentationml\.presentation))/;
  export const WPS_MIME_TYPES =
    /(application\/(vnd\.ms-word\.document\.macroEnabled\.12|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)|application\/(vnd\.ms-excel\.sheet\.macroEnabled\.12|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)|application\/(vnd\.ms-powerpoint\.presentation\.macroEnabled\.12|vnd\.openxmlformats-officedocument\.presentationml\.presentation))/;
  export const OTHER_MIME_TYPES =
    /(application\/pdf|application\/rtf|text\/plain|text\/html|application\/xml|application\/json)/;

  export const OFFICE_MIME_TYPES = new RegExp(
    [
      MESSAGE_FILE.MICROSOFT_MIME_TYPES.source,
      MESSAGE_FILE.GOOGLE_MIME_TYPES.source,
      MESSAGE_FILE.WPS_MIME_TYPES.source,
      MESSAGE_FILE.OTHER_MIME_TYPES.source,
    ].join('|'),
  );

  // ALL MIME TYPES
  export const ALL_MIME_TYPES = new RegExp(
    [
      MESSAGE_FILE.IMAGE_MIME_TYPES.source,
      MESSAGE_FILE.OFFICE_MIME_TYPES.source,
    ].join('|'),
  );
}
