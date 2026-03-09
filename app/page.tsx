import { prisma } from "@/lib/prisma"

export default async function Page() {

  const customers = await prisma.customer.findMany()

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Clientes</h1>

      <pre>
        {JSON.stringify(customers, null, 2)}
      </pre>
    </div>
  )
}