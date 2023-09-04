export default function objectNotNull(obj)
{
    return typeof(obj) === "object" && obj !== null;
}