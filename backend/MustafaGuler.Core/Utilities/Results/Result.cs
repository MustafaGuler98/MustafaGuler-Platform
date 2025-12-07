using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace MustafaGuler.Core.Utilities.Results
{
    public class Result
    {
        public bool IsSuccess { get; private set; }
        public string Message { get; private set; }
        public int StatusCode { get; private set; }
        public List<string>? Errors { get; private set; }

        protected Result(bool isSuccess, int statusCode, string message, List<string>? errors = null)
        {
            IsSuccess = isSuccess;
            StatusCode = statusCode;
            Message = message;
            Errors = errors;
        }

        public static Result Success(int statusCode = 200, string message = null)
        {
            return new Result(true, statusCode, message);
        }

        public static Result Failure(int statusCode, string message, List<string>? errors = null)
        {
            return new Result(false, statusCode, message, errors);
        }

        public static Result Failure(int statusCode, string message)
        {
            return new Result(false, statusCode, message, new List<string> { message });
        }
    }

    public class Result<T> : Result
    {
        public T? Data { get; private set; }

        private Result(T data, bool isSuccess, int statusCode, string message, List<string>? errors = null)
            : base(isSuccess, statusCode, message, errors)
        {
            Data = data;
        }


        public static Result<T> Success(T data, int statusCode = 200, string message = null)
        {
            return new Result<T>(data, true, statusCode, message);
        }

        public new static Result<T> Failure(int statusCode, string message, List<string>? errors = null)
        {
            return new Result<T>(default, false, statusCode, message, errors);
        }

        public new static Result<T> Failure(int statusCode, string message)
        {
            return new Result<T>(default, false, statusCode, message, new List<string> { message });
        }
    }
}