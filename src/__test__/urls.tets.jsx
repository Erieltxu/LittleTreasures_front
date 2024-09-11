import {
    BASE_URL,
    USER_REGISTER,
    USER_DETAIL,
    USER_LOGIN,
    UPDATE_USER,
    DELETE_USER,
    CHILDREN_API,
    EVENTS_API,
    REGISTRATIONS_API,
    USER_API,
    IS_ADMIN_API
  } from '../config/urls';
  
  describe('URL Constants', () => {
    test('BASE_URL should be correct', () => {
      expect(BASE_URL).toBe('http://127.0.0.1:8000/api/v1/');
    });
  
    test('USER_REGISTER should be correct', () => {
      expect(USER_REGISTER).toBe(`${BASE_URL}register/`);
    });
  
    test('USER_DETAIL should be correct', () => {
      expect(USER_DETAIL).toBe(`${BASE_URL}profile/`);
    });
  
    test('USER_LOGIN should be correct', () => {
      expect(USER_LOGIN).toBe(`${BASE_URL}login/`);
    });
  
    test('UPDATE_USER should be correct', () => {
      expect(UPDATE_USER).toBe(`${BASE_URL}profile/update/`);
    });
  
    test('DELETE_USER should be correct', () => {
      expect(DELETE_USER).toBe(`${BASE_URL}profile/delete/`);
    });
  
    test('CHILDREN_API should be correct', () => {
      expect(CHILDREN_API).toBe(`${BASE_URL}children/`);
    });
  
    test('EVENTS_API should be correct', () => {
      expect(EVENTS_API).toBe(`${BASE_URL}events/`);
    });
  
    test('REGISTRATIONS_API should be correct', () => {
      expect(REGISTRATIONS_API).toBe(`${BASE_URL}registrations/`);
    });
  
    test('USER_API should be correct', () => {
      expect(USER_API).toBe('/api/user/');
    });
  
    test('IS_ADMIN_API should be correct', () => {
      expect(IS_ADMIN_API).toBe(`${BASE_URL}is_admin/`);
    });
  });
  