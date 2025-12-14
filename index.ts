export class StatusResult {
  static ok = 'Ok'
  static error = 'Error'
  static notFound = 'NotFound'
  static unauthorized = 'Unauthorized'
  static needRedirect = 'NeedRedirect'
}

export class StatusCode {
  // static SwitchingProtocols = 101;
  // static Continue = 100;
  // static Processing = 102;

  static OK = 200
  static Created = 201
  static Accepted = 202
  static NonAuthoritativeInformation = 203
  static NoContent = 204
  // static ResetContent = 205;
  // static PartialContent = 206;
  // static MultiStatus = 207;

  static MultipleChoices = 300
  static MovedPermanently = 301
  static MovedTemporarily = 302
  static SeeOther = 303
  // static UseProxy = 305;
  // static NotModified = 304;
  static TemporaryRedirect = 307
  // static PermanentRedirect = 308;

  static BadRequest = 400
  static Unauthorized = 401
  static PaymentRequired = 402
  static NotFound = 404
  static Forbidden = 403
  // static MethodNotAllowed = 405;
  // static ProxyAuthenticationRequired = 407;
  // static NotAcceptable = 406;
  // static RequestTimeOut = 408;
  // static Gone = 410;
  // static Conflict = 409;
  // static LengthRequired = 411;
  // static RequestEntityTooLarge = 413;
  // static PreconditionFailed = 412;
  // static RequestURITooLarge = 414;
  // static RequestedRangeNotSatisfiable = 416;
  // static UnsupportedMediaType = 415;
  // static ExpectationFailed = 417;
  // static UnprocessableEntity = 422;
  // static ImATeapot = 418;
  // static Locked = 423;
  // static FailedDependency = 424;
  // static UnorderedCollection = 425;
  // static UpgradeRequired = 426;
  // static PreconditionRequired = 428;
  // static TooManyRequests = 429;
  // static RequestHeaderFieldsTooLarge = 431;

  static InternalServerError = 500
  static NotImplemented = 501
  static BadGateway = 502
  // static ServiceUnavailable = 503;
  // static GatewayTimeOut = 504;
  // static HTTPVersionNotSupported = 505;
  // static VariantAlsoNegotiates = 506;
  // static InsufficientStorage = 507;
  // static BandwidthLimitExceeded = 509;
  // static NotExtended = 510;
  // static NetworkAuthenticationRequire = 511;
}

type TData = object | boolean | string | null
type TCount = number | null
type TError = any | null
type TInfo = any | null
type TIdentity = any | null
type TRedirectTo = string | undefined
type TToken = string | null

interface TResultIn {
  statusCode?: StatusCode
  statusResult?: StatusResult
  message?: string
  data?: TData
  count?: TCount
  error?: TError
  info?: TInfo
  identity?: TIdentity
  redirectTo?: TRedirectTo
  token?: TToken
  bodyWrap?: boolean
}

interface TFuncParams {
  statusCode?: StatusCode
  statusResult?: StatusResult
  message?: string
  error?: TError
  info?: TInfo
  identity?: TIdentity
  data?: TData
  count?: TCount
  redirectTo?: TRedirectTo
  token?: TToken
  bodyWrap?: boolean
}

export class ResponseBodyVOBase {
  statusResult: StatusResult = StatusResult.ok
  message: string = ''
  data: TData = null
  count: TCount = null
  error: TError = null
  info: TInfo = null
  identity: TIdentity = null
}

export class ResponseBodyVO extends ResponseBodyVOBase {
  redirectTo?: TRedirectTo = undefined
  token?: TToken = null
  bodyWrap?: boolean = true
}

export class ResponseBodyVOFull extends ResponseBodyVO {
  statusCode?: StatusCode = StatusCode.OK
}

export class ResponseBodyJSON {
  statusCode?: StatusCode = StatusCode.OK
  body: string = ''
}

export type ResponseVoAWS = ResponseBodyJSON | ResponseBodyVO

class Result extends ResponseBodyVOFull {
  constructor({
    statusCode = StatusCode.OK,
    statusResult = StatusResult.ok,
    message,
    data = null,
    count = null,
    error = null,
    info = null,
    identity = null,
    redirectTo = undefined,
    token = null,
    bodyWrap = true,
  }: TResultIn) {
    super()
    this.statusCode = statusCode
    this.statusResult = statusResult
    this.message = !message ? '' : message
    this.count = count
    this.data = data
    this.error = error
    this.info = info
    this.identity = identity
    this.redirectTo = redirectTo
    this.token = token
    this.bodyWrap = bodyWrap
  } 
}


  /**
   * Serverless: According to the API Gateway specs, the body content must be stringified
   * If use to AWS Appsync need response value without body wrap
   */
  export const bodyToString = (result: ResponseBodyVOFull): ResponseVoAWS => {
    let _err = result.error && result.error.message ? result.error.message : !result.error ? null : JSON.stringify(result.error)

    const valueBody: ResponseBodyVOFull = {
      statusResult: result.statusResult,
      message: result.message,
      data: result.data,
      count: result.count,
      error: _err,
      info: result.info,
      identity: result.identity,
      token: result.token,
    }
    if (result.redirectTo) valueBody.redirectTo = result.redirectTo
    const valueBodyWrap: ResponseBodyJSON = {
      statusCode: result.statusCode,
      body: JSON.stringify(valueBody),
    }

    return result.bodyWrap ? valueBodyWrap : valueBody
  }


export class CreateResponse {
  /**
   * Success
   * @param data
   * @param count
   * @param message
   * @param bodyWrap
   */
  static success({
    data = null,
    count = null,
    message = 'success',
    bodyWrap = true,
    info = null,
    identity = null,
    token = null,
  }: TFuncParams): ResponseBodyVO {
    const result = new Result({
      statusCode: StatusCode.OK,
      statusResult: StatusResult.ok,
      message,
      data,
      count,
      bodyWrap,
      info,
      identity,
      token,
    }) as ResponseBodyVOFull
    return result
  }

  /**
   * Created
   * @param data
   * @param message
   * @param bodyWrap
   */
  static created({
    data,
    message = 'created',
    bodyWrap = true,
    info = null,
    identity = null,
  }: TFuncParams): ResponseBodyVO {
    const result = new Result({
      statusCode: StatusCode.Created,
      statusResult: StatusResult.ok,
      message,
      data,
      bodyWrap,
      info,
      identity,
    }) as ResponseBodyVOFull
    return result
  }

  /**
   * Update
   * @param data
   * @param message
   * @param bodyWrap
   */
  static updated({
    data,
    message = 'updated',
    bodyWrap = true,
    info = null,
    identity = null,
  }: TFuncParams): ResponseBodyVO {
    const result = new Result({
      statusCode: StatusCode.OK,
      statusResult: StatusResult.ok,
      message,
      data,
      bodyWrap,
      info,
      identity,
    }) as ResponseBodyVOFull
    return result
  }

  /**
   * Update or Create
   * @param data
   * @param message
   * @param bodyWrap
   */
  static updateOrCreate({
    data,
    message = 'update_or_create',
    bodyWrap = true,
    info = null,
    identity = null,
  }: TFuncParams): ResponseBodyVO {
    const result = new Result({
      statusCode: StatusCode.OK,
      statusResult: StatusResult.ok,
      message,
      data,
      bodyWrap,
      info,
      identity,
    }) as ResponseBodyVOFull
    return result
  }

  /**
   * Not Found
   * @param error
   * @param message
   * @param bodyWrap
   */
  static notFound({ error = null, message = '', bodyWrap = true, identity = null }: TFuncParams): ResponseBodyVO {
    const result = new Result({
      statusCode: StatusCode.NotFound,
      statusResult: StatusResult.notFound,
      message,
      data: null,
      error,
      bodyWrap,
      identity,
    }) as ResponseBodyVOFull
    return result
  }

  /**
   * Error
   * @param error
   * @param statusCode
   * @param message
   * @param bodyWrap
   */
  static error({
    error = null,
    statusCode = StatusCode.BadRequest,
    message = 'Error',
    bodyWrap = true,
    identity = null,
  }: TFuncParams): ResponseBodyVO {
    const result = new Result({
      statusCode,
      statusResult: StatusResult.error,
      data: null,
      error,
      message,
      bodyWrap,
      identity,
    }) as ResponseBodyVOFull
    return result
  }

  /**
   * Unauthorized
   * @param error
   * @param statusCode
   * @param message
   * @param bodyWrap
   */
  static unauthorized({
    error = null,
    statusCode = StatusCode.Unauthorized,
    message = 'Unauthorized',
    bodyWrap = true,
    identity = null,
  }: TFuncParams): ResponseBodyVO {
    const result = new Result({
      statusCode,
      statusResult: StatusResult.unauthorized,
      data: null,
      error,
      message,
      bodyWrap,
      identity,
    }) as ResponseBodyVOFull
    return result
  }

  /**
   * Redirect
   * @param error
   * @param statusCode
   * @param message
   * @param bodyWrap
   */
  static redirect({
    statusCode = StatusCode.MovedTemporarily,
    message = '',
    bodyWrap = true,
    redirectTo = '',
    identity = null,
  }: TFuncParams): ResponseBodyVO {
    const result = new Result({
      statusCode,
      statusResult: StatusResult.needRedirect,
      data: null,
      error: null,
      message,
      redirectTo,
      bodyWrap,
      identity,
    }) as ResponseBodyVOFull
    return result
  }

  /**
   * Custom
   * @param statusCode
   * @param statusResult
   * @param message
   * @param error
   * @param data
   * @param count
   * @param bodyWrap
   */
  static custom({
    statusCode = StatusCode.OK,
    statusResult = StatusResult.ok,
    message = '',
    error = null,
    data = null,
    count = null,
    bodyWrap = true,
    info = null,
    identity = null,
  }: TFuncParams): ResponseVoAWS {
    const result = new Result({
      statusCode,
      statusResult,
      message,
      error,
      data,
      count,
      bodyWrap,
      info,
      identity,
    }) as ResponseBodyVOFull
    return result
  }
}

export type TMessagesREST = {
  TOTAL: string
  NOT_FOUND: string
  ROUTE_NOT_FOUND: string
  TOKEN_EXPIRED_ERROR: string
  AUTHORISED: string
  UNAUTHORISED: string
  ERROR_AUTHORISED: string
  EXIST: string
  NOT_EXIST: string
  ERROR_EXIST: string
  IDENTIFIER: string
  NOT_IDENTIFIER: string
  ERROR_IDENTIFIER: string
  CREATE: string
  NOT_CREATE: string
  ERROR_CREATE: string
  UPDATE: string
  ERROR_UPDATE: string
  NOT_UPDATE: string
  UPDATE_OR_CREATE: string
  ERROR_UPDATE_OR_CREATE: string
  NOT_UPDATE_OR_CREATE: string
  UPDATE_MANY: string
  NOT_UPDATE_MANY: string
  ERROR_UPDATE_MANY: string
  UPDATE_MANY_AND_GET_MANY: string
  NOT_UPDATE_MANY_AND_GET_MANY: string
  ERROR_UPDATE_MANY_AND_GET_MANY: string
  GET_ONE_AND_CHILDREN: string
  NOT_GET_ONE_AND_CHILDREN: string
  ERROR_GET_ONE_AND_CHILDREN: string
  GET: string
  NOT_GET: string
  ERROR_GET: string
  GET_MANY: string
  NOT_GET_MANY: string
  ERROR_GET_MANY: string
  GET_LIST: string
  NOT_GET_LIST: string
  ERROR_GET_LIST: string
  GET_MANY_AND_COUNT: string
  NOT_GET_MANY_AND_COUNT: string
  ERROR_GET_MANY_AND_COUNT: string
  GET_LIST_AND_COUNT: string
  NOT_GET_LIST_AND_COUNT: string
  ERROR_GET_LIST_AND_COUNT: string
  GET_COUNT: string
  NOT_GET_COUNT: string
  ERROR_GET_COUNT: string
  DELETE: string
  NOT_DELETE: string
  ERROR_DELETE: string
  DELETE_MANY: string
  NOT_DELETE_MANY: string
  ERROR_DELETE_MANY: string
  INITIALISE: string
  NOT_INITIALISE: string
  ERROR_INITIALISE: string
  INCREMENT: string
  NOT_INCREMENT: string
  ERROR_INCREMENT: string
  DECREMENT: string
  NOT_DECREMENT: string
  ERROR_DECREMENT: string
  COUNTER_DAY: string
  NOT_COUNTER_DAY: string
  ERROR_COUNTER_DAY: string
  COUNTER_MONTH: string
  NOT_COUNTER_MONTH: string
  ERROR_COUNTER_MONTH: string
  COUNTER_YEAR: string
  NOT_COUNTER_YEAR: string
  ERROR_COUNTER_YEAR: string
  TEST: string
  NOT_TEST: string
  ERROR_TEST: string
  AGGREGATION: string
  NOT_AGGREGATION: string
  ERROR_AGGREGATION: string
  USER_REGISTRATION: string
  NOT_USER_REGISTRATION: string
  ERROR_USER_REGISTRATION: string
  USER_ALREADY_REGISTERED: string
  USER_DID_NOT_REGISTER: string
  ERROR_USER_ALREADY_REGISTERED: string
  USER_LOGIN: string
  NOT_USER_LOGIN: string
  ERROR_USER_LOGIN: string
  USER_LOGOUT: string
  NOT_USER_LOGOUT: string
  ERROR_USER_LOGOUT: string
  USER_AUTHENTICATION_REFRESH: string
  NOT_USER_AUTHENTICATION_REFRESH: string
  ERROR_USER_AUTHENTICATION_REFRESH: string
  MARK_ACTION: string
  NOT_MARK_ACTION: string
  ERROR_MARK_ACTION: string
  MARK_FOR_DELETE: string
  NOT_MARK_FOR_DELETE: string
  ERROR_MARK_FOR_DELETE: string
  MARK_SYSTEM: string
  NOT_MARK_SYSTEM: string
  ERROR_MARK_SYSTEM: string
  ACC_DOCUMENT_CONFIRMATION: string
  NOT_ACC_DOCUMENT_CONFIRMATION: string
  ERROR_ACC_DOCUMENT_CONFIRMATION: string
  ACC_DOCUMENT_CONFIRMATION_UNDO: string
  NOT_ACC_DOCUMENT_CONFIRMATION_UNDO: string
  ERROR_ACC_DOCUMENT_CONFIRMATION_UNDO: string
  ACC_DOCUMENT_RE_CONFIRMATION: string
  NOT_ACC_DOCUMENT_RE_CONFIRMATION: string
  ERROR_ACC_DOCUMENT_RE_CONFIRMATION: string
  ACC_DOCUMENT_RE_UNDO_CONFIRMATION: string
  NOT_ACC_DOCUMENT_RE_UNDO_CONFIRMATION: string
  ERROR_ACC_DOCUMENT_RE_UNDO_CONFIRMATION: string
  GENERATE_PDF: string
  NOT_GENERATE_PDF: string
  ERROR_GENERATE_PDF: string
  GENERATE_XLS: string
  NOT_GENERATE_XLS: string
  ERROR_GENERATE_XLS: string
  MIXED_DATA: string
  NOT_MIXED_DATA: string
  ERROR_MIXED_DATA: string
  ID_VALID: string
  NOT_ID_VALID: string
  ERROR_ID_VALID: string
}

export const messagesREST = (prefix: string, suffix: string = ''): TMessagesREST => {
  return {
    TOTAL: `${prefix}_TOTAL${suffix}`,

    NOT_FOUND: `${prefix}_NOT_FOUND${suffix}`,

    ROUTE_NOT_FOUND: `${prefix}_ROUTE_NOT_FOUND${suffix}`,

    TOKEN_EXPIRED_ERROR: `${prefix}_TOKEN_EXPIRED_ERROR${suffix}`,

    ID_VALID: `${prefix}_ID_VALID${suffix}`,
    NOT_ID_VALID: `${prefix}_NOT_ID_VALID${suffix}`,
    ERROR_ID_VALID: `${prefix}_ERROR_ID_VALID${suffix}`,

    AUTHORISED: `${prefix}_AUTHORISED${suffix}`,
    UNAUTHORISED: `${prefix}_UNAUTHORISED${suffix}`,
    ERROR_AUTHORISED: `${prefix}_ERROR_AUTHORISED${suffix}`,

    EXIST: `${prefix}_EXIST${suffix}`,
    NOT_EXIST: `${prefix}_NOT_EXIST${suffix}`,
    ERROR_EXIST: `${prefix}_ERROR_EXIST${suffix}`,

    IDENTIFIER: `${prefix}_IDENTIFIER${suffix}`,
    NOT_IDENTIFIER: `${prefix}_NOT_IDENTIFIER${suffix}`,
    ERROR_IDENTIFIER: `${prefix}_ERROR_IDENTIFIER${suffix}`,

    CREATE: `${prefix}_ITEM_CREATE${suffix}`,
    NOT_CREATE: `${prefix}_ITEM_NOT_CREATE${suffix}`,
    ERROR_CREATE: `${prefix}_ITEM_ERROR_CREATE${suffix}`,

    UPDATE: `${prefix}_ITEM_UPDATE${suffix}`,
    ERROR_UPDATE: `${prefix}_ITEM_ERROR_UPDATE${suffix}`,
    NOT_UPDATE: `${prefix}_ITEM_NOT_UPDATE${suffix}`,

    UPDATE_OR_CREATE: `${prefix}_ITEM_UPDATE_OR_CREATE${suffix}`,
    ERROR_UPDATE_OR_CREATE: `${prefix}_ITEM_UPDATE_OR_CREATE${suffix}`,
    NOT_UPDATE_OR_CREATE: `${prefix}_ITEM_NOT_UPDATE_OR_CREATE${suffix}`,

    UPDATE_MANY: `${prefix}_UPDATE_MANY${suffix}`,
    NOT_UPDATE_MANY: `${prefix}_NOT_UPDATE_MANY${suffix}`,
    ERROR_UPDATE_MANY: `${prefix}_ERROR_UPDATE_MANY${suffix}`,

    UPDATE_MANY_AND_GET_MANY: `${prefix}_UPDATE_MANY_AND_GET_MANY${suffix}`,
    NOT_UPDATE_MANY_AND_GET_MANY: `${prefix}_NOT_UPDATE_MANY_AND_GET_MANY${suffix}`,
    ERROR_UPDATE_MANY_AND_GET_MANY: `${prefix}_ERROR_UPDATE_MANY_AND_GET_MANY${suffix}`,

    GET_ONE_AND_CHILDREN: `${prefix}_GET_ONE_AND_CHILDREN${suffix}`,
    NOT_GET_ONE_AND_CHILDREN: `${prefix}_NOT_GET_ONE_AND_CHILDREN${suffix}`,
    ERROR_GET_ONE_AND_CHILDREN: `${prefix}_ERROR_GET_ONE_AND_CHILDREN${suffix}`,

    GET: `${prefix}_ITEM_GET${suffix}`,
    NOT_GET: `${prefix}_ITEM_NOT_GET${suffix}`,
    ERROR_GET: `${prefix}_ITEM_ERROR_GET${suffix}`,

    GET_MANY: `${prefix}_GET_MANY${suffix}`,
    NOT_GET_MANY: `${prefix}_NOT_GET_MANY${suffix}`,
    ERROR_GET_MANY: `${prefix}_ERROR_GET_MANY${suffix}`,

    GET_LIST: `${prefix}_GET_LIST${suffix}`,
    NOT_GET_LIST: `${prefix}_NOT_GET_LIST${suffix}`,
    ERROR_GET_LIST: `${prefix}_ERROR_GET_LIST${suffix}`,

    GET_MANY_AND_COUNT: `${prefix}_GET_MANY_AND_COUNT${suffix}`,
    NOT_GET_MANY_AND_COUNT: `${prefix}_NOT_GET_MANY_AND_COUNT${suffix}`,
    ERROR_GET_MANY_AND_COUNT: `${prefix}_ERROR_GET_MANY_AND_COUNT${suffix}`,

    GET_LIST_AND_COUNT: `${prefix}_GET_LIST_AND_COUNT${suffix}`,
    NOT_GET_LIST_AND_COUNT: `${prefix}_NOT_GET_LIST_AND_COUNT${suffix}`,
    ERROR_GET_LIST_AND_COUNT: `${prefix}_ERROR_GET_LIST_AND_COUNT${suffix}`,

    GET_COUNT: `${prefix}_GET_COUNT${suffix}`,
    NOT_GET_COUNT: `${prefix}_NOT_GET_COUNT${suffix}`,
    ERROR_GET_COUNT: `${prefix}_ERROR_GET_COUNT${suffix}`,

    DELETE: `${prefix}_ITEM_DELETE${suffix}`,
    NOT_DELETE: `${prefix}_ITEM_NOT_DELETE${suffix}`,
    ERROR_DELETE: `${prefix}_ITEM_ERROR_DELETE${suffix}`,

    DELETE_MANY: `${prefix}_DELETE_MANY${suffix}`,
    NOT_DELETE_MANY: `${prefix}_NOT_DELETE_MANY${suffix}`,
    ERROR_DELETE_MANY: `${prefix}_ERROR_DELETE_MANY${suffix}`,

    INITIALISE: `${prefix}_INITIALISE${suffix}`,
    NOT_INITIALISE: `${prefix}_NOT_INITIALISE${suffix}`,
    ERROR_INITIALISE: `${prefix}_ERROR_INITIALISE${suffix}`,

    INCREMENT: `${prefix}_INCREMENT${suffix}`,
    NOT_INCREMENT: `${prefix}_NOT_INCREMENT${suffix}`,
    ERROR_INCREMENT: `${prefix}_ERROR_INCREMENT${suffix}`,

    DECREMENT: `${prefix}_DECREMENT${suffix}`,
    NOT_DECREMENT: `${prefix}_NOT_DECREMENT${suffix}`,
    ERROR_DECREMENT: `${prefix}_ERROR_DECREMENT${suffix}`,

    COUNTER_DAY: `${prefix}_COUNTER_DAY${suffix}`,
    NOT_COUNTER_DAY: `${prefix}_NOT_COUNTER_DAY${suffix}`,
    ERROR_COUNTER_DAY: `${prefix}_ERROR_COUNTER_DAY${suffix}`,

    COUNTER_MONTH: `${prefix}_COUNTER_MONTH${suffix}`,
    NOT_COUNTER_MONTH: `${prefix}_NOT_COUNTER_MONTH${suffix}`,
    ERROR_COUNTER_MONTH: `${prefix}_ERROR_COUNTER_MONTH${suffix}`,

    COUNTER_YEAR: `${prefix}_COUNTER_YEAR${suffix}`,
    NOT_COUNTER_YEAR: `${prefix}_NOT_COUNTER_YEAR${suffix}`,
    ERROR_COUNTER_YEAR: `${prefix}_ERROR_COUNTER_YEAR${suffix}`,

    TEST: `${prefix}_TEST${suffix}`,
    NOT_TEST: `${prefix}_NOT_TEST${suffix}`,
    ERROR_TEST: `${prefix}_ERROR_TEST${suffix}`,

    AGGREGATION: `${prefix}_AGGREGATION${suffix}`,
    NOT_AGGREGATION: `${prefix}_NOT_AGGREGATION${suffix}`,
    ERROR_AGGREGATION: `${prefix}_ERROR_AGGREGATION${suffix}`,

    USER_REGISTRATION: `${prefix}_USER_REGISTRATION${suffix}`,
    NOT_USER_REGISTRATION: `${prefix}_NOT_USER_REGISTRATION${suffix}`,
    ERROR_USER_REGISTRATION: `${prefix}_ERROR_USER_REGISTRATION${suffix}`,

    USER_ALREADY_REGISTERED: `${prefix}_USER_ALREADY_REGISTERED${suffix}`,
    USER_DID_NOT_REGISTER: `${prefix}_USER_DID_NOT_REGISTER${suffix}`,
    ERROR_USER_ALREADY_REGISTERED: `${prefix}_ERROR_USER_ALREADY_REGISTERED${suffix}`,

    USER_LOGIN: `${prefix}_USER_LOGIN${suffix}`,
    NOT_USER_LOGIN: `${prefix}_NOT_USER_LOGIN${suffix}`,
    ERROR_USER_LOGIN: `${prefix}_ERROR_USER_LOGIN${suffix}`,

    USER_LOGOUT: `${prefix}_USER_LOGOUT${suffix}`,
    NOT_USER_LOGOUT: `${prefix}_NOT_USER_LOGOUT${suffix}`,
    ERROR_USER_LOGOUT: `${prefix}_ERROR_USER_LOGOUT${suffix}`,

    USER_AUTHENTICATION_REFRESH: `${prefix}_USER_AUTHENTICATION_REFRESH${suffix}`,
    NOT_USER_AUTHENTICATION_REFRESH: `${prefix}_NOT_USER_AUTHENTICATION_REFRESH${suffix}`,
    ERROR_USER_AUTHENTICATION_REFRESH: `${prefix}_ERROR_USER_AUTHENTICATION_REFRESH${suffix}`,

    MARK_ACTION: `${prefix}_MARK_ACTION${suffix}`,
    NOT_MARK_ACTION: `${prefix}_NOT_MARK_ACTION${suffix}`,
    ERROR_MARK_ACTION: `${prefix}_ERROR_MARK_ACTION${suffix}`,

    MARK_FOR_DELETE: `${prefix}_MARK_FOR_DELETE${suffix}`,
    NOT_MARK_FOR_DELETE: `${prefix}_NOT_MARK_FOR_DELETE${suffix}`,
    ERROR_MARK_FOR_DELETE: `${prefix}_ERROR_MARK_FOR_DELETE${suffix}`,

    MARK_SYSTEM: `${prefix}_MARK_SYSTEM${suffix}`,
    NOT_MARK_SYSTEM: `${prefix}_NOT_MARK_SYSTEM${suffix}`,
    ERROR_MARK_SYSTEM: `${prefix}_ERROR_MARK_SYSTEM${suffix}`,

    // confirmation of the document.
    ACC_DOCUMENT_CONFIRMATION: `${prefix}_ACC_DOCUMENT_CONFIRMATION${suffix}`,
    NOT_ACC_DOCUMENT_CONFIRMATION: `${prefix}_NOT_ACC_DOCUMENT_CONFIRMATION${suffix}`,
    ERROR_ACC_DOCUMENT_CONFIRMATION: `${prefix}_ERROR_ACC_DOCUMENT_CONFIRMATION${suffix}`,

    // confirmation of the document.
    ACC_DOCUMENT_CONFIRMATION_UNDO: `${prefix}_ACC_DOCUMENT_CONFIRMATION__UNDO${suffix}`,
    NOT_ACC_DOCUMENT_CONFIRMATION_UNDO: `${prefix}_NOT_ACC_DOCUMENT_CONFIRMATION${suffix}`,
    ERROR_ACC_DOCUMENT_CONFIRMATION_UNDO: `${prefix}_ERROR_ACC_DOCUMENT_CONFIRMATION${suffix}`,

    // re-confirmation of the document.
    ACC_DOCUMENT_RE_CONFIRMATION: `${prefix}_ACC_DOCUMENT_RE_CONFIRMATION${suffix}`,
    NOT_ACC_DOCUMENT_RE_CONFIRMATION: `${prefix}_NOT_ACC_DOCUMENT_RE_CONFIRMATION${suffix}`,
    ERROR_ACC_DOCUMENT_RE_CONFIRMATION: `${prefix}_ERROR_ACC_DOCUMENT_RE_CONFIRMATION${suffix}`,

    // re-confirmation UNDO of the document.
    ACC_DOCUMENT_RE_UNDO_CONFIRMATION: `${prefix}_ACC_DOCUMENT_RE_UNDO_CONFIRMATION${suffix}`,
    NOT_ACC_DOCUMENT_RE_UNDO_CONFIRMATION: `${prefix}_NOT_ACC_DOCUMENT_RE_UNDO_CONFIRMATION${suffix}`,
    ERROR_ACC_DOCUMENT_RE_UNDO_CONFIRMATION: `${prefix}_ERROR_ACC_DOCUMENT_RE_UNDO_CONFIRMATION${suffix}`,

    GENERATE_PDF: `${prefix}_GENERATE_PDF${suffix}`,
    NOT_GENERATE_PDF: `${prefix}_NOT_MGENERATE_PDF${suffix}`,
    ERROR_GENERATE_PDF: `${prefix}_ERROR_GENERATE_PDF${suffix}`,

    GENERATE_XLS: `${prefix}_GENERATE_XLS${suffix}`,
    NOT_GENERATE_XLS: `${prefix}_NOT_MGENERATE_XLS${suffix}`,
    ERROR_GENERATE_XLS: `${prefix}_ERROR_GENERATE_XLS${suffix}`,

    MIXED_DATA: `${prefix}_MIXED_DATA${suffix}`,
    NOT_MIXED_DATA: `${prefix}_NOT_MIXED_DATA${suffix}`,
    ERROR_MIXED_DATA: `${prefix}_ERROR_MIXED_DATA${suffix}`,
  }
}

export const optionsPaginationParams = ['limit', 'skip', 'count']

export type TMongoFilterNormalise = { [fieldName: string]: any }

/**
 * Normalise filter for mongoose
 * @param regexFields
 * @param filter
 * @param excludeFields
 */
export const normaliseMongoFilter = (
  filter: TMongoFilterNormalise,
  regexFields: string[],
  excludeFields?: string[]
) => {
  const _filter: TMongoFilterNormalise = {}
  const excludeParams =
    excludeFields && Array.isArray(excludeFields) && excludeFields.length > 0 ? excludeFields : optionsPaginationParams

  Object.keys(filter).forEach((f) => {
    const v = filter[f]
    if (
      !(
        v === null ||
        (typeof v === 'number' && isNaN(v)) ||
        v === Infinity ||
        v === undefined ||
        excludeParams.includes(f)
      )
    ) {
      _filter[f] = filter[f]

      if (regexFields.includes(f)) _filter[f] = { $regex: new RegExp(_filter[f], 'gi') }
    }
  })

  return _filter
}

export type TMongoPaginate =
  | {
      skip: number
      limit: number
    }
  | {}

export type TFieldsGQL =
  | 'create'
  | 'count'
  | 'find'
  | 'findOne'
  | 'findMany'
  | 'findOneByID'
  | 'findManyByIDs'
  | 'update'
  | 'updateOneByID'
  | 'updateManyByIDs'
  | 'deleteOne'
  | 'deleteOneByID'
  | 'deleteManyByIDs'
  | 'markActiveByIDs'
  | 'markForDeleteByIDs'
  | 'markSystemByIDs'
  | 'init'

/**
 * Normalise Mongo Paginate params
 * @param filter
 */
export const normaliseMongoPaginate = (filter: TMongoFilterNormalise): TMongoPaginate => {
  let res: TMongoPaginate = {}

  if (filter.hasOwnProperty('limit') && filter.hasOwnProperty('skip')) {
    res = {
      skip: filter.skip ? parseInt(filter.skip, 10) : 0,
      limit: filter.limit ? parseInt(filter.limit, 10) : 50,
    }
  }

  return res
}

export const controlResponseNull = (
  data: object,
  okResultOf: 'create' | 'update' | 'update_or_create' | 'update_many' | 'increment' | 'decrement',
  prefix: string,
  bodyWrap: boolean = true,
  identity: string | null = null
) => {
  let result

  if (data) {
    if (okResultOf === 'create') {
      result = CreateResponse.created({
        data,
        message: messagesREST(prefix).CREATE,
        bodyWrap,
        identity,
      })
    }

    if (okResultOf === 'update') {
      result = CreateResponse.updated({
        data,
        message: messagesREST(prefix).UPDATE,
        bodyWrap,
        identity,
      })
    }

    if (okResultOf === 'update_or_create') {
      result = CreateResponse.updateOrCreate({
        data,
        message: messagesREST(prefix).UPDATE_OR_CREATE,
        bodyWrap,
      })
    }

    if (okResultOf === 'update_many') {
      result = CreateResponse.updated({
        data,
        message: messagesREST(prefix).UPDATE_MANY,
        bodyWrap,
        identity,
      })
    }

    if (okResultOf === 'increment') {
      result = CreateResponse.updated({
        data,
        message: messagesREST(prefix).INCREMENT,
        bodyWrap,
        identity,
      })
    }

    if (okResultOf === 'decrement') {
      result = CreateResponse.updated({
        data,
        message: messagesREST(prefix).DECREMENT,
        bodyWrap,
        identity,
      })
    }
  } else {
    let messageErr = ''
    if (okResultOf === 'create') messageErr = messagesREST(prefix).NOT_CREATE
    if (okResultOf === 'update') messageErr = messagesREST(prefix).NOT_UPDATE
    if (okResultOf === 'update_or_create') messageErr = messagesREST(prefix).NOT_UPDATE_OR_CREATE
    if (okResultOf === 'update_many') messageErr = messagesREST(prefix).NOT_UPDATE_MANY
    if (okResultOf === 'increment') messageErr = messagesREST(prefix).NOT_INCREMENT
    if (okResultOf === 'decrement') messageErr = messagesREST(prefix).NOT_DECREMENT

    result = CreateResponse.error({
      data: data,
      message: messageErr,
      bodyWrap,
      identity,
    })
  }

  return result
}

export const parseMessageResponse = (message: string, separator: string = '__'): string[] => {
  let res = message.split(separator)
  if (res.length < 2) return ['', '', '']

  return res
}

// **************************************************************************************
// **********************     ENTITY INPUT TYPES    *************************************
// **************************************************************************************

type TID = string
type TIDs = string[]

// CREATE
export interface TEntityInputCreate<M> {
  values: M
}

// GET LIST
export interface TEntityInputGetList<F, S> {
  filter: F
  sort: S
  withCount: boolean
  paging: TMongoPaginate
}

// ONE BY ID
export interface TEntityInputOneByID {
  id: TID
}

// MANY BY IDs
export interface TEntityInputManyByIDs {
  ids: TIDs
}

// VALUES ONE BY ID
export interface TEntityInputValuesOneByID<M> {
  id: TID
  values: M
}

// VALUES MANY BY IDs
export interface TEntityInputValuesManyByIDs<M> {
  ids: TIDs
  values: M
}

export type TEntityInput =
  | TEntityInputCreate<any>
  | TEntityInputGetList<any, any>
  | TEntityInputOneByID
  | TEntityInputValuesOneByID<any>
  | TEntityInputManyByIDs
  | TEntityInputValuesManyByIDs<any>
