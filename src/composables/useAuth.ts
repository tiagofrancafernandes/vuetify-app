import { useLocalStorage } from '@vueuse/core';
import axios, { AxiosRequestConfig } from 'axios';
import _ from 'lodash';
import moment from 'moment';
import { computed } from 'vue';

import { Jwt } from '@/helpers/jwt';
import {
  IAuthOptions,
  IAuthResponse,
  IdentityUser,
  ILoginRequest,
} from '@/interfaces/auth';
import { config } from '@/services';

export function useAuth() {
  const accessToken = useLocalStorage('accessToken', '');
  const refreshToken = useLocalStorage('refreshToken', '');

  const user = computed<IdentityUser | null>(() =>
    Jwt.parseUser(accessToken.value),
  );
  const expires = computed(() => Jwt.getExpires(accessToken.value));

  const isAuthenticated = computed(() => !_.isNull(user.value));
  const identityId = computed(() => user.value?.id ?? null);

  const axiosInstacne = axios.create(config);

  function isExpires(seconds: number = 60) {
    return (
      !expires.value ||
      moment(expires.value).subtract(seconds, 'seconds').isBefore()
    );
  }

  async function fetchAccessToken(options?: IAuthOptions) {
    const { throw: throwError = true } = options ?? {};

    try {
      const { data } = await axiosInstacne.post<IAuthResponse>(
        '/auth/refreshToken',
        undefined,
        {
          headers: {
            refreshToken: refreshToken.value,
          },
        },
      );

      accessToken.value = data.accessToken;
      refreshToken.value = data.refreshToken;
    } catch (error) {
      if (throwError) {
        throw error;
      }

      accessToken.value = '';
      refreshToken.value = '';
    }
  }

  async function getAccessTokenSilently(options?: IAuthOptions) {
    const { seconds } = options ?? {};

    if (isExpires(seconds)) {
      await fetchAccessToken(options);
    }

    return accessToken.value;
  }

  async function getUserSilently(options?: IAuthOptions) {
    if (isExpires(options?.seconds)) {
      await getAccessTokenSilently(options);
    }

    return user.value;
  }

  async function login(dto: ILoginRequest, config?: AxiosRequestConfig) {
    const { data } = await axiosInstacne.post<IAuthResponse>(
      '/auth/login',
      dto,
      { ...config },
    );

    accessToken.value = data.accessToken;
    refreshToken.value = data.refreshToken;
  }

  async function logout(config?: AxiosRequestConfig) {
    const value = refreshToken.value;
    const token = accessToken.value;

    accessToken.value = '';
    refreshToken.value = '';

    await axiosInstacne.patch<IAuthResponse>(
      '/auth/refreshToken',
      {
        value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        ...config,
      },
    );
  }

  const updatedImages = useLocalStorage('images', {
    photo: '',
    cover: '',
  });

  const photoUrl = computed(() =>
    user.value?.photoUrl
      ? `${import.meta.env.VITE_API_URL}/auth/photo?username=${
          user.value.username
        }` +
        (updatedImages.value.photo
          ? `&updated=${updatedImages.value.photo}`
          : '')
      : import.meta.env.VITE_NO_AVATAR_URL,
  );

  const coverUrl = computed(() =>
    user.value?.coverUrl
      ? `${import.meta.env.VITE_API_URL}/auth/cover?username=${
          user.value.username
        }` +
        (updatedImages.value.cover
          ? `&updated=${updatedImages.value.cover}`
          : '')
      : import.meta.env.VITE_NO_BACKGROUND_URL,
  );

  function updateImage(type: 'photo' | 'cover') {
    updatedImages.value[type] = moment().unix().toString();
  }

  return {
    isAuthenticated,
    expires,
    user,
    identityId,
    login,
    logout,
    fetchAccessToken,
    getAccessTokenSilently,
    getUserSilently,
    photoUrl,
    coverUrl,
    updateImage,
  };
}
