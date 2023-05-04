import { LogOut, User } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '~/ui/avatar';
import { Button } from '~/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/ui/dropdown-menu';

const UserDropdown = ({
  name,
  email,
  image,
}: {
  name?: string;
  email?: string;
  image?: string;
}) => {
  const router = useRouter();
  const Av = useMemo(() => name?.slice(0, 2) ?? 'A', [name]);
  const logout = () => void signOut({ callbackUrl: '/' });
  const linkprofile = () => void router.push('/profile');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={image ?? undefined} alt={name ?? 'avatar'} />
            <AvatarFallback>{Av}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-foreground" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={linkprofile}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { UserDropdown };
