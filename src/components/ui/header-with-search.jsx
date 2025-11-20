import React from 'react';
import { Link } from 'react-router-dom';
import { Grid2x2PlusIcon, MenuIcon, SearchIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetFooter } from './sheet';
import { Button, buttonVariants } from './button-shadcn';
import { cn } from '../../utils/cn';
import { SearchModal } from './search-modal';

export function HeaderWithSearch({ account }) {
	const [open, setOpen] = React.useState(false);

	const links = [
		{
			label: 'Dashboard',
			href: '/',
		},
		{
			label: 'Create Project',
			href: '/create',
		},
	];

	// Sample search data for fund tracking
	const searchData = [
		{
			id: 'dashboard',
			title: 'View Dashboard',
			description: 'Overview of all government projects',
			category: 'Navigation',
		},
		{
			id: 'create',
			title: 'Create Project',
			description: 'Add a new government fund project',
			category: 'Navigation',
		},
		{
			id: 'blockchain',
			title: 'Blockchain Tracking',
			description: 'Track fund allocation on blockchain',
			category: 'Features',
		},
	];

	return (
		<header
			className={cn(
				'sticky top-0 z-50 w-full border-b backdrop-blur-lg',
				'bg-background/95 supports-[backdrop-filter]:bg-background/80',
			)}
			style={{
				backgroundColor: 'rgba(15, 23, 42, 0.95)',
				borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
			}}
		>
			<nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
				<Link
					to="/"
					className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 duration-100"
					style={{
						color: 'var(--text-main)',
						textDecoration: 'none',
					}}
				>
					<Grid2x2PlusIcon className="size-6" style={{ color: 'var(--primary)' }} />
					<p className="font-mono text-lg font-bold" style={{
						background: 'linear-gradient(to right, var(--primary), var(--secondary))',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
					}}>
						trace.it
					</p>
				</Link>

				<div className="flex items-center gap-2">
					<div className="hidden items-center gap-1 lg:flex">
						{links.map((link) => (
							<Link
								key={link.href}
								className={buttonVariants({ variant: 'ghost' })}
								to={link.href}
								style={{ color: 'var(--text-main)' }}
							>
								{link.label}
							</Link>
						))}
					</div>

					{account && (
						<div style={{
							fontSize: '0.875rem',
							color: 'var(--text-muted)',
							padding: '0.5rem 1rem',
							background: 'rgba(99, 102, 241, 0.1)',
							borderRadius: '0.5rem',
							border: '1px solid rgba(99, 102, 241, 0.2)',
						}}>
							{account.substring(0, 6)}...{account.substring(account.length - 4)}
						</div>
					)}

					<SearchModal data={searchData}>
						<Button
							variant="outline"
							className="relative size-9 cursor-pointer p-0 md:border xl:h-9 xl:w-60 xl:justify-between xl:px-3 xl:py-2"
							style={{
								backgroundColor: 'transparent',
								borderColor: 'rgba(99, 102, 241, 0.3)',
								color: 'var(--text-muted)',
							}}
						>
							<span className="hidden xl:inline-flex">Search...</span>
							<span className="sr-only">Search</span>
							<SearchIcon className="size-4" />
						</Button>
					</SearchModal>

					<Sheet open={open} onOpenChange={setOpen}>
						<Button
							size="icon"
							variant="outline"
							onClick={() => setOpen(!open)}
							className="lg:hidden"
							style={{
								backgroundColor: 'transparent',
								borderColor: 'rgba(99, 102, 241, 0.3)',
							}}
						>
							<MenuIcon className="size-4" />
						</Button>
						<SheetContent
							className="bg-background/95 supports-[backdrop-filter]:bg-background/80 gap-0 backdrop-blur-lg"
							showClose={false}
							side="left"
							style={{ backgroundColor: 'rgba(15, 23, 42, 0.98)' }}
						>
							<div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
								{links.map((link) => (
									<Link
										key={link.href}
										className={buttonVariants({
											variant: 'ghost',
											className: 'justify-start',
										})}
										to={link.href}
										onClick={() => setOpen(false)}
										style={{ color: 'var(--text-main)' }}
									>
										{link.label}
									</Link>
								))}
							</div>
							{account && (
								<SheetFooter style={{ padding: '1rem' }}>
									<div style={{
										width: '100%',
										textAlign: 'center',
										fontSize: '0.875rem',
										color: 'var(--text-muted)',
										padding: '0.75rem',
										background: 'rgba(99, 102, 241, 0.1)',
										borderRadius: '0.5rem',
									}}>
										Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}
									</div>
								</SheetFooter>
							)}
						</SheetContent>
					</Sheet>
				</div>
			</nav>
		</header>
	);
}
